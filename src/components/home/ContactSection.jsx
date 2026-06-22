"use client";

import {
  Form,
  Button,
  TextField,
  Label,
  Input,
  FieldError,
  TextArea,
} from "@heroui/react";
import { FaUser, FaCommentAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-black dark:text-white mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your small contribution can save a life. Reach out for blood requests
          or to become a hero donor.
        </p>
        <p className="mt-3 font-bold text-danger">
          Emergency contact: +880 1700-000000
        </p>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-lg dark:shadow-zinc-700/10">
        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TextField
              name="name"
              fullWidth
              isRequired
              validate={(v) =>
                v.length > 0 && v.length < 3 ? "Name too short" : null
              }
            >
              <Label className="text-black dark:text-white flex items-center gap-2 mb-2 font-medium">
                <FaUser className="text-danger" /> Name
              </Label>
              <Input
                placeholder="Enter your name"
                className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-black dark:text-white"
              />
              <FieldError className="text-danger text-xs" />
            </TextField>

            <TextField
              name="email"
              fullWidth
              isRequired
              validate={(v) =>
                v.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
                  ? "Invalid email"
                  : null
              }
            >
              <Label className="text-black dark:text-white flex items-center gap-2 mb-2 font-medium">
                <FaEnvelope className="text-danger" /> Email
              </Label>
              <Input
                placeholder="example@email.com"
                className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-black dark:text-white"
              />
              <FieldError className="text-danger text-xs" />
            </TextField>
          </div>

          <div className="space-y-6">
            <TextField
              name="number"
              fullWidth
              isRequired
              validate={(v) =>
                v.length > 0 && !/^\d{10,15}$/.test(v) ? "Invalid number" : null
              }
            >
              <Label className="text-black dark:text-white flex items-center gap-2 mb-2 font-medium">
                <FaPhoneAlt className="text-danger" /> Phone
              </Label>
              <Input
                placeholder="01XXXXXXXXX"
                className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-black dark:text-white"
              />
              <FieldError className="text-danger text-xs" />
            </TextField>

            <div className="w-full flex flex-col gap-2">
              <Label className="text-black dark:text-white flex items-center gap-2 mb-0 font-medium">
                <FaCommentAlt className="text-danger" /> Message
              </Label>
              <TextArea
                name="message"
                fullWidth
                placeholder="How can we help you?"
                className="bg-gray-50 dark:bg-black/20 min-h-30 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-black dark:text-white"
              />
            </div>
          </div>

          <div className="lg:col-span-2 pt-4">
            <Button
              type="submit"
              className="w-full bg-danger text-white font-bold h-12 rounded-lg hover:bg-danger-600 transition-all"
            >
              Contact Us
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default ContactSection;
