"use client";
import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const FieldError = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
};

const RegisterPage = () => {
  const Router = useRouter();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState(null);
  const [selectedUpazilaName, setSelectedUpazilaName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrictId) return [];
    return upazilas.filter(
      (u) => String(u.district_id) === String(selectedDistrictId),
    );
  }, [selectedDistrictId]);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IMGBB_URL}?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      { method: "POST", body: formData },
    );
    const data = await response.json();
    return data.success ? data.data.url : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");
    const bloodGroup = formData.get("bloodGroup");

    let newErrors = {};
    if (!name || name.length < 3)
      newErrors.name = "Name must be at least 3 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email address";
    if (!bloodGroup) newErrors.bloodGroup = "Please select blood group";
    if (!selectedDistrictName) newErrors.district = "Please select district";
    if (!selectedUpazilaName) newErrors.upazila = "Please select upazila";
    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirm_password = "Passwords do not match!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const file = fileInputRef.current?.files[0];
      const avatarUrl = file ? await uploadToImgBB(file) : "";

      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: avatarUrl,
        role: "donor",
        status: "active",
        bloodGroup: bloodGroup,
        district: selectedDistrictName,
        upazila: selectedUpazilaName,
      });

      if (error) {
        toast.error(`Registration Failed ${error.message}`);
      } else {
        toast.success("Registration Successful!", {
          onClose: () => Router.push("/auth/login"),
        });
      }
    } catch (err) {
      toast.error(`Registration Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <Form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border dark:border-gray-800"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Register
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            role="button"
            onClick={() => fileInputRef.current.click()}
            className="w-24 h-24 rounded-full bg-gray-200 cursor-pointer overflow-hidden relative border-2 border-dashed"
          >
            {avatar ? (
              <Image src={avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="text-xs flex items-center justify-center h-full">
                Upload
              </span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
            className="hidden"
            accept="image/*"
          />
        </div>

        <TextField name="name" className="mb-4">
          <Label>Name</Label>
          <Input />
          <FieldError message={errors.name} />
        </TextField>

        <TextField name="email" className="mb-4">
          <Label>Email</Label>
          <Input type="email" />
          <FieldError message={errors.email} />
        </TextField>

        <div className="mb-4">
          <Select name="bloodGroup" placeholder="Select blood group">
            <Label>Blood Group</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator>▼</Select.Indicator>
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={bloodGroups}>
                {(blood) => (
                  <ListBox.Item key={blood.id} textValue={blood.name}>
                    {blood.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>
          <FieldError message={errors.bloodGroup} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Select
              placeholder="Select district"
              onSelectionChange={(key) => {
                const district = districts.find((d) => d.name === key);
                setSelectedDistrictId(district?.id || null);
                setSelectedDistrictName(district?.name || "");
                setSelectedUpazilaId(null);
                setSelectedUpazilaName("");
              }}
            >
              <Label>District</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator>▼</Select.Indicator>
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={districts}>
                  {(i) => (
                    <ListBox.Item key={i.name} id={i.name} textValue={i.name}>
                      {i.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <FieldError message={errors.district} />
          </div>

          <div>
            <Select
              placeholder="Select upazila"
              onSelectionChange={(key) => {
                const upazila = filteredUpazilas.find((u) => u.name === key);
                setSelectedUpazilaId(upazila?.id || null);
                setSelectedUpazilaName(upazila?.name || "");
              }}
              isDisabled={!selectedDistrictId}
            >
              <Label>Upazila</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator>▼</Select.Indicator>
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={filteredUpazilas}>
                  {(i) => (
                    <ListBox.Item key={i.name} id={i.name} textValue={i.name}>
                      {i.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <FieldError message={errors.upazila} />
          </div>
        </div>

        <div className="relative mb-4">
          <TextField name="password">
            <Label>Password</Label>
            <Input type={showPassword ? "text" : "password"} />
            <FieldError message={errors.password} />
          </TextField>
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <div className="relative mb-6">
          <TextField name="confirm_password">
            <Label>Confirm Password</Label>
            <Input type={showConfirmPassword ? "text" : "password"} />
            <FieldError message={errors.confirm_password} />
          </TextField>
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-red-600 text-white font-bold py-3 mt-4"
        >
          Register Now
        </Button>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-red-600 font-bold underline">
            Login
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default RegisterPage;
