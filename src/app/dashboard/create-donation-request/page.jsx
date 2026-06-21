"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Form,
  Button,
  TextField,
  Label,
  Input,
  Select,
  ListBox,
  DateField,
  TimeField,
  TextArea,
} from "@heroui/react";

import { useSession } from "@/lib/auth-client";
import { districts, upazilas } from "@/data/bdgeoData";
import { bloodGroups } from "@/data/bloodGroups";

const CreateDonationRequest = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: null,
    donationTime: null,
    requestMessage: "",
  });

  const filteredUpazilas = useMemo(() => {
    const districtObj = districts.find(
      (d) => d.name === formData.recipientDistrict,
    );
    if (!districtObj) return [];
    return upazilas.filter((u) => u.district_id === districtObj.id);
  }, [formData.recipientDistrict]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (session?.user?.status === "blocked") {
      toast.error("Access Denied: You are blocked.");
      return;
    }
    toast.success("Donation request created successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-8 md:p-12">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Donation Request
          </h2>
        </header>

        <Form onSubmit={handleSubmit}>
          {/* Main Horizontal Split: Left and Right Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <TextField isReadOnly value={session?.user?.name || ""}>
                <Label className="font-semibold text-gray-700">
                  requester name
                </Label>
                <Input className="bg-gray-100" />
              </TextField>

              <TextField isReadOnly value={session?.user?.email || ""}>
                <Label className="font-semibold text-gray-700">
                  requester email
                </Label>
                <Input className="bg-gray-100" />
              </TextField>

              <TextField
                isRequired
                onChange={(val) =>
                  setFormData({ ...formData, recipientName: val })
                }
              >
                <Label className="font-semibold text-gray-700">
                  recipient name
                </Label>
                <Input placeholder="Enter recipient name" />
              </TextField>

              <Select
                onSelectionChange={(key) =>
                  setFormData({
                    ...formData,
                    recipientDistrict: key,
                    recipientUpazila: "",
                  })
                }
              >
                <Label className="font-semibold text-gray-700">
                  recipient district
                </Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
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
                isDisabled={!formData.recipientDistrict}
                onSelectionChange={(key) =>
                  setFormData({ ...formData, recipientUpazila: key })
                }
              >
                <Label className="font-semibold text-gray-700">
                  recipient upazila
                </Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
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

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <TextField
                isRequired
                onChange={(val) =>
                  setFormData({ ...formData, hospitalName: val })
                }
              >
                <Label className="font-semibold text-gray-700">
                  hospital name
                </Label>
                <Input placeholder="Dhaka Medical College Hospital" />
              </TextField>

              <TextField
                isRequired
                onChange={(val) =>
                  setFormData({ ...formData, fullAddress: val })
                }
              >
                <Label className="font-semibold text-gray-700">
                  full address line
                </Label>
                <Input placeholder="Zahir Raihan Rd, Dhaka" />
              </TextField>

              <Select
                onSelectionChange={(key) =>
                  setFormData({ ...formData, bloodGroup: key })
                }
              >
                <Label className="font-semibold text-gray-700">
                  blood group
                </Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox items={bloodGroups}>
                    {(bg) => (
                      <ListBox.Item key={bg.id} id={bg.id}>
                        {bg.name}
                      </ListBox.Item>
                    )}
                  </ListBox>
                </Select.Popover>
              </Select>

              <DateField
                onChange={(date) =>
                  setFormData({ ...formData, donationDate: date })
                }
              >
                <Label className="font-semibold text-gray-700">
                  donation date
                </Label>
                <DateField.Group>
                  <DateField.Input>
                    {(s) => <DateField.Segment segment={s} />}
                  </DateField.Input>
                </DateField.Group>
              </DateField>

              <TimeField
                onChange={(time) =>
                  setFormData({ ...formData, donationTime: time })
                }
              >
                <Label className="font-semibold text-gray-700">
                  donation time
                </Label>
                <TimeField.Group>
                  <TimeField.Input>
                    {(s) => <TimeField.Segment segment={s} />}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
            </div>
          </div>

          {/* Full Width Message Area */}
          <div className="mt-6">
            <Label className="font-semibold text-gray-700 mb-2 block">
              request message
            </Label>
            <TextArea
              className="h-32 w-full"
              placeholder="Explain the urgency and details here..."
              onChange={(e) =>
                setFormData({ ...formData, requestMessage: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <Button type="reset" variant="flat" className="px-8">
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-danger text-white px-10 font-bold"
            >
              request button
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
