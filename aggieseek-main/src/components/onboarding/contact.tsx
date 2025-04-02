"use client";
import { useEffect, useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationSettings } from "@prisma/client";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaDiscord, FaPhone, FaEnvelope } from "react-icons/fa6";
import { addWebhook, getWebhooks } from "@/actions/webhooks";
import { getNotificationSettings } from "@/actions/notification-settings";

export default function Contact({ onNext, onPrevious }) {
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings | null>(null);
  const [webhooks, setWebhooks] = useState<string[]>([]);
  const [webhookInput, setWebhookInput] = useState<string>("");

  const deleteWebhook = (webhookUrl: string) => {
    fetch("/api/users/webhooks", {
      method: "DELETE",
      body: JSON.stringify({ webhookUrl }),
    })
      .then((res) => {
        if (!res.ok) return;
        setWebhookInput("");
        setWebhooks(webhooks.filter((prev) => prev !== webhookUrl));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getNotificationSettings().then((data) =>
      setNotificationSettings(data ?? null)
    );
    getWebhooks().then((data) => setWebhooks(data ?? []));
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <Image
            src={"/images/logo-black.png"}
            alt={"AggieSeek"}
            width={200}
            height={100}
          />
          <div className={"mt-8"}>Please input your contact information!</div>
        </DialogTitle>
        <DialogDescription>
          Inputting your information ensures that you get notified properly when
          classes open up. If you ever need to change your information, you can
          change it any time in the settings page!
        </DialogDescription>
      </DialogHeader>
      <div className={"flex flex-col gap-y-6 pt-4"}>
        <div className=" flex flex-col gap-2">
          <Label className={"flex gap-x-2"}>
            <FaEnvelope />
            Email Address
          </Label>
          <Input
            className={"w-64"}
            value={notificationSettings?.email || ""}
            disabled
          />
        </div>
        <div className=" flex flex-col gap-2">
          <Label className={"flex gap-x-2"}>
            <FaPhone />
            Phone Number
          </Label>
          <Input
            autoComplete={"mobile tel"}
            placeholder="Enter your phone number"
            className={"w-64"}
          />
        </div>
        <div className=" flex flex-col gap-2">
          <Label htmlFor={"webhook"} className={"flex gap-x-2"}>
            <FaDiscord />
            Discord Webhooks
          </Label>
          <div
            className={
              "flex rounded-md flex-col border p-4 gap-y-4 max-w-64 md:max-w-md lg:max-w-3xl"
            }
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addWebhook(webhookInput);
              }}
              className={"flex h-1/4 gap-x-2 items-center"}
            >
              <Input
                autoComplete={"off"}
                value={webhookInput}
                placeholder="Enter your Discord webhook"
                onChange={(e) => setWebhookInput(e.target.value)}
                id={"webhook"}
                className={"h-full w-full"}
              />
              <Button
                className={"transition-transform active:scale-95"}
                type={"submit"}
              >
                + Add
              </Button>
            </form>

            <div className={"flex flex-col rounded-md border h-full p-4"}>
              {webhooks.map((webhook, index) => (
                <p
                  onClick={() => deleteWebhook(webhook)}
                  className={
                    "text-sm hover:line-through hover:cursor-pointer hover:text-red-600 break-words whitespace-normal  "
                  }
                  key={index}
                >
                  {webhook}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="text-sm hover:underline" onClick={onPrevious}>
          Previous
        </button>
        <button className="text-sm hover:underline" onClick={onNext}>
          Next
        </button>
      </div>
    </>
  );
}
