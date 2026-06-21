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
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bloodGroup: session.user.bloodGroup || "",
        district: session.user.district || "",
        upazila: session.user.upazila || "",
      });
      setAvatar(session.user.image || null);
    }
  }, [session]);

  const filteredUpazilas = useMemo(() => {
    const districtObj = districts.find((d) => d.name === formData.district);
    if (!districtObj) return [];
    return upazilas.filter((u) => u.district_id === districtObj.id);
  }, [formData.district]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.user.update({
      ...formData,
      image: avatar,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Profile Updated!");
      setIsEditing(false);
      refetch();
    }
    setLoading(false);
  };

  if (isPending)
    return <div className="text-center p-12">Loading Profile...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Profile Settings
          </h1>

          {/* Button style updated to square (radius="none") and colors applied */}
          <Button
            type={isEditing ? "submit" : "button"}
            form="profile-form"
            onClick={() => !isEditing && setIsEditing(true)}
            className={`font-bold text-white rounded-none ${
              isEditing ? "bg-green-600" : "bg-danger"
            }`}
          >
            {isEditing ? (
              <>
                <FiSave /> Save
              </>
            ) : (
              <>
                <FiEdit2 /> Edit
              </>
            )}
          </Button>
        </div>

        {/* Horizontal Two-Part Layout */}
        <div className="flex flex-col md:flex-row p-8 gap-12">
          {/* LEFT: Avatar */}
          <div className="md:w-1/3 flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
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
              onChange={(e) =>
                setAvatar(URL.createObjectURL(e.target.files[0]))
              }
            />
            <p className="mt-6 font-semibold text-lg">
              {formData.name || "User"}
            </p>
          </div>

          {/* RIGHT: Form Fields */}
          <div className="md:w-2/3">
            <Form id="profile-form" onSubmit={handleSubmit} className="space-y-6 ">
              <TextField name="name" isReadOnly={!isEditing}>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </TextField>

              <TextField name="email" isReadOnly={true}>
                <Label>Email</Label>
                <Input value={formData.email} />
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

              <div className="grid grid-cols-2 gap-6">
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
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
