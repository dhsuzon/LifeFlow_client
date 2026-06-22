"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiEdit2, FiSave, FiCamera, FiUser } from "react-icons/fi";
import {
  Form,
  Button,
  TextField,
  Label,
  Input,
  Select,
  ListBox,
} from "@heroui/react";

import { districts, upazilas } from "@/data/bdgeoData";
import { bloodGroups } from "@/data/bloodGroups";
import { authClient, useSession } from "@/lib/auth-client";

const ProfilePage = () => {
  const { data: session, refetch, isPending } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  useEffect(() => {
    if (!session?.user) return;

    const timer = window.setTimeout(() => {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bloodGroup: session.user.bloodGroup || "",
        district: session.user.district || "",
        upazila: session.user.upazila || "",
      });
      setAvatar(session.user.image || null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [session]);

  const filteredUpazilas = useMemo(() => {
    const districtObj = districts.find((d) => d.name === formData.district);
    if (!districtObj) return [];
    return upazilas.filter((u) => u.district_id === districtObj.id);
  }, [formData.district]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent an accidental submit while the form is still in view mode.
    if (!isEditing) return;

    setLoading(true);

    try {
      let image = avatar;

      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append("image", avatarFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_IMGBB_URL}?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
          { method: "POST", body: uploadData },
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Profile image upload failed");
        }

        image = result.data.url;
      }

      const { error } = await authClient.updateUser({
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        image,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setAvatar(image);
      setAvatarFile(null);
      toast.success("Profile Updated!");
      setIsEditing(false);
      await refetch();
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (isPending)
    return <div className="text-center p-12">Loading Profile...</div>;

  return (
    <div className="mx-auto max-w-6xl">
      <Form
        id="profile-form"
        onSubmit={handleSubmit}
        className="block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        {/* The form action is always at the top of the form. */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:p-8">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
            Profile Settings
          </h1>

          {/* Button style updated to square (radius="none") and colors applied */}
          {isEditing ? (
            <Button
              key="save-profile"
              type="submit"
              isLoading={loading}
              isDisabled={loading}
              className="rounded-none bg-green-600 font-bold text-white"
            >
              <>
                <FiSave /> Save
              </>
            </Button>
          ) : (
            <Button
              key="edit-profile"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                setIsEditing(true);
              }}
              className="rounded-none bg-danger font-bold text-white"
            >
              <>
                <FiEdit2 /> Edit
              </>
            </Button>
          )}
        </div>

        {/* Horizontal Two-Part Layout */}
        <div className="flex flex-col gap-6 p-4 sm:p-8 md:flex-row md:gap-12">
          {/* LEFT: Avatar */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/30 sm:p-8 md:w-1/3">
            <div
              className="relative w-48 h-48 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={() => isEditing && fileInputRef.current.click()}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Profile"
                  width={192}
                  height={192}
                  loading="eager"
                  className="object-cover"
                />
              ) : (
                <FiUser size={80} className="text-gray-400" />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <FiCamera size={40} />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAvatarFile(file);
                setAvatar(URL.createObjectURL(file));
              }}
            />
            <p className="mt-6 font-semibold text-lg">
              {formData.name || "User"}
            </p>
          </div>

          {/* RIGHT: Form Fields */}
          <div className="md:w-2/3">
            <div className="space-y-6">
              <TextField name="name" isReadOnly={!isEditing}>
                <Label>Full Name</Label>
                <Input
                  readOnly={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </TextField>

              <TextField name="email" isReadOnly={true}>
                <Label>Email</Label>
                <Input readOnly value={formData.email} />
              </TextField>

              <Select
                isDisabled={!isEditing}
                selectedKey={formData.bloodGroup}
                onSelectionChange={(key) =>
                  setFormData({ ...formData, bloodGroup: key })
                }
              >
                <Label>Blood Group</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator>▼</Select.Indicator>
                </Select.Trigger>
                <Select.Popover>
                  <ListBox items={bloodGroups}>
                    {(bg) => (
                      <ListBox.Item key={bg.name} id={bg.name}>
                        {bg.name}
                      </ListBox.Item>
                    )}
                  </ListBox>
                </Select.Popover>
              </Select>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Select
                  isDisabled={!isEditing}
                  selectedKey={formData.district}
                  onSelectionChange={(key) =>
                    setFormData({ ...formData, district: key, upazila: "" })
                  }
                >
                  <Label>District</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator>▼</Select.Indicator>
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox items={districts}>
                      {(d) => (
                        <ListBox.Item key={d.name} id={d.name}>
                          {d.name}
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  isDisabled={!isEditing || !formData.district}
                  selectedKey={formData.upazila}
                  onSelectionChange={(key) =>
                    setFormData({ ...formData, upazila: key })
                  }
                >
                  <Label>Upazila</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator>▼</Select.Indicator>
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox items={filteredUpazilas}>
                      {(u) => (
                        <ListBox.Item key={u.name} id={u.name}>
                          {u.name}
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ProfilePage;
