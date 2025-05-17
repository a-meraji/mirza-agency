"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import AppointmentTab from "./components/AppointmentTab/AppointmentTab";
import BookingTab from "./components/BookingTab/BookingTab";
import BlogTab from "./components/BlogTab/BlogTab";
import UserTab from "./components/UserTab/UserTab";
import PaymentTab from "./components/PaymentTab/PaymentTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <div className="container mx-auto p-4 rtl font-iransans">
      <h1 className="text-2xl font-bold mb-6 text-[#462d22]">پنل مدیریت جلسات</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">مدیریت جلسات</TabsTrigger>
          <TabsTrigger value="bookings">رزروهای ثبت شده</TabsTrigger>
          <TabsTrigger value="blogs">مدیریت وبلاگ</TabsTrigger>
          <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>
          <TabsTrigger value="payments">مدیریت پرداخت‌ها</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <AppointmentTab />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingTab />
        </TabsContent>
        
        <TabsContent value="blogs">
          <BlogTab />
        </TabsContent>
        
        <TabsContent value="users">
          <UserTab />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
} 