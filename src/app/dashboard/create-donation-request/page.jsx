"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  DateField,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";

import { createDonationRequest } from "@/lib/actions/donation-request";
import { useSession } from "@/lib/auth-client";
import { districts, upazilas } from "@/data/bdgeoData";
import { bloodGroups } from "@/data/bloodGroups";

const initialFormData = {
  recipientName: "",
  recipientDistrict: "",
  recipientUpazila: "",
  hospitalName: "",
  fullAddress: "",
  bloodGroup: "",
  donationDate: null,
  donationTime: null,
  requestMessage: "",
};

const CreateDonationRequestPage = () => {
  const { data: session, isPending: isSessionPending } = useSession();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isActiveUser = session?.user?.status === "active";

  const filteredUpazilas = useMemo(() => {
    const district = districts.find(
      (item) => item.name === formData.recipientDistrict,
    );

    if (!district) return [];

    return upazilas.filter(
      (item) => String(item.district_id) === String(district.id),
    );
  }, [formData.recipientDistrict]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleReset = () => setFormData(initialFormData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await createDonationRequest({
        ...formData,
        donationDate: formData.donationDate?.toString() || "",
        donationTime: formData.donationTime?.toString() || "",
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Donation request created successfully!");
      handleReset();
    } catch {
      toast.error("Could not create the donation request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSessionPending) {
    return <div className="p-12 text-center">Loading request form...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="block rounded-3xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:p-8 lg:p-10"
      >
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Create Donation Request
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Provide the recipient and donation details below.
          </p>
        </header>

        {!isActiveUser && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            Your account is not active. Only active users can create donation
            requests.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-10">
          <TextField isReadOnly>
            <Label>Requester Name</Label>
            <Input
              readOnly
              value={session?.user?.name || ""}
              className="border-gray-300 bg-gray-100 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </TextField>

          <TextField isReadOnly>
            <Label>Requester Email</Label>
            <Input
              readOnly
              value={session?.user?.email || ""}
              className="border-gray-300 bg-gray-100 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </TextField>

          <TextField isRequired>
            <Label>Recipient Name</Label>
            <Input
              required
              value={formData.recipientName}
              placeholder="Enter recipient name"
              onChange={(event) =>
                updateField("recipientName", event.target.value)
              }
            />
          </TextField>

          <Select
            isRequired
            selectedKey={formData.bloodGroup}
            onSelectionChange={(key) => updateField("bloodGroup", key)}
          >
            <Label>Blood Group</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator>▼</Select.Indicator>
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={bloodGroups}>
                {(group) => (
                  <ListBox.Item key={group.name} id={group.name}>
                    {group.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            isRequired
            selectedKey={formData.recipientDistrict}
            onSelectionChange={(key) =>
              setFormData((current) => ({
                ...current,
                recipientDistrict: key,
                recipientUpazila: "",
              }))
            }
          >
            <Label>Recipient District</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator>▼</Select.Indicator>
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={districts}>
                {(district) => (
                  <ListBox.Item key={district.name} id={district.name}>
                    {district.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            isRequired
            isDisabled={!formData.recipientDistrict}
            selectedKey={formData.recipientUpazila}
            onSelectionChange={(key) => updateField("recipientUpazila", key)}
          >
            <Label>Recipient Upazila</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator>▼</Select.Indicator>
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={filteredUpazilas}>
                {(upazila) => (
                  <ListBox.Item key={upazila.name} id={upazila.name}>
                    {upazila.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>

          <TextField isRequired>
            <Label>Hospital Name</Label>
            <Input
              required
              value={formData.hospitalName}
              placeholder="Dhaka Medical College Hospital"
              onChange={(event) =>
                updateField("hospitalName", event.target.value)
              }
            />
          </TextField>

          <TextField isRequired>
            <Label>Full Address Line</Label>
            <Input
              required
              value={formData.fullAddress}
              placeholder="Zahir Raihan Rd, Dhaka"
              onChange={(event) =>
                updateField("fullAddress", event.target.value)
              }
            />
          </TextField>

          <DateField
            isRequired
            value={formData.donationDate}
            onChange={(value) => updateField("donationDate", value)}
          >
            <Label>Donation Date</Label>
            <DateField.Group>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
            </DateField.Group>
          </DateField>

          <TimeField
            isRequired
            value={formData.donationTime}
            onChange={(value) => updateField("donationTime", value)}
          >
            <Label>Donation Time</Label>
            <TimeField.Group>
              <TimeField.Input>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>
        </div>

        <div className="mt-6">
          <Label className="mb-2 block">Request Message</Label>
          <TextArea
            required
            value={formData.requestMessage}
            className="min-h-32 w-full"
            placeholder="Explain why blood is needed and include important details."
            onChange={(event) =>
              updateField("requestMessage", event.target.value)
            }
          />
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="reset" variant="flat" isDisabled={isSubmitting}>
            Reset
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={isSubmitting || !isActiveUser}
            className="bg-danger font-bold text-white"
          >
            Request Blood
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateDonationRequestPage;
