"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function Page() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "Isamtanu",
    email: "isamtanu@gmail.com",
    phone: "",
    dob: "",
    country: "",
    state: "",
    city: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Profile data submitted:", profileData);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-indigo-600 p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Profile Settings</h1>
        <Link href="/dashboard/overview">
          <Button className="bg-white text-indigo-600 hover:bg-gray-100">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Avatar Section */}
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image
                src="/profile-1.png"
                alt="Profile avatar"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            <h2 className="text-lg font-medium">{profileData.username}</h2>
            <p className="text-gray-400 text-sm">{profileData.email}</p>
          </div>

          {/* Form Section */}
          <div className="md:w-3/4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Info Section */}
              <Card className="bg-gray-900 border-gray-800 rounded-sm">
                <CardHeader>
                  <CardTitle className="text-gray-300">Profile Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm text-gray-400"
                      >
                        FIRST NAME
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm text-gray-400"
                      >
                        LAST NAME
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="text-sm text-gray-400"
                      >
                        USERNAME
                      </label>
                      <Input
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm text-gray-400">
                        EMAIL
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm text-gray-400">
                        PHONE
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dob" className="text-sm text-gray-400">
                        DATE OF BIRTH
                      </label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={profileData.dob}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="text-sm text-gray-400"
                      >
                        COUNTRY
                      </label>
                      <Input
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm text-gray-400">
                        STATE
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={profileData.state}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm text-gray-400">
                        CITY
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Divider */}
              <div className="border-t border-gray-800 my-6"></div>

              {/* Change Password Section */}
              <Card className="bg-gray-900 border-gray-800 rounded-sm">
                <CardHeader>
                  <CardTitle className="text-gray-300">
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="currentPassword"
                      className="text-sm text-gray-400"
                    >
                      CURRENT PASSWORD
                    </label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700 text-white h-12"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="newPassword"
                        className="text-sm text-gray-400"
                      >
                        NEW PASSWORD
                      </label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm text-gray-400"
                      >
                        CONFIRM PASSWORD
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-gray-500 text-center mt-4">
                You may be asked to re-login once your profile information is
                updated.
              </p>

              <div className="flex justify-center mt-6 w-full">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 w-full h-12 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
