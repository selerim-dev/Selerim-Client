"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth-context";
import { useNotification } from "../../../components/NotificationProvider";
import authService from "../../../lib/auth";
import { componentClasses } from "../../../components/DesignSystem";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function DashboardContactPage() {
  const { user } = useAuth();
  const { notify } = useNotification();
  
  const [form, setForm] = useState({ 
    name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "", 
    email: user?.email || "", 
    subject: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.contactSupport(form);
      setSuccess(true);
      setForm({ 
        name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "", 
        email: user?.email || "", 
        subject: "",
        message: "",
        priority: "medium"
      });
      notify({ message: 'Message sent successfully! We\'ll get back to you soon.', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className={componentClasses.sectionTitle}>Contact Support</h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Need help with your projects or have questions? Our support team is here to help you get the most out of Selerim.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className={componentClasses.formContainer}>
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully!</h3>
                <p className="text-lg text-white/70 mb-8">
                  Thank you for reaching out. Our support team will review your message and get back to you as soon as possible.
                </p>
                <button
                  className={componentClasses.gradientButton}
                  onClick={() => setSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={componentClasses.formLabel}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className={componentClasses.formInput}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={componentClasses.formLabel}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={componentClasses.formInput}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className={componentClasses.formLabel}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={componentClasses.formInput}
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className={componentClasses.formLabel}>
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className={componentClasses.formInput}
                    >
                      <option value="low">Low - General Question</option>
                      <option value="medium">Medium - Feature Request</option>
                      <option value="high">High - Technical Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={componentClasses.formLabel}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={8}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className={componentClasses.formInput}
                    placeholder="Please provide detailed information about your inquiry, including any relevant project details, error messages, or specific requirements..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={componentClasses.gradientButton}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                    {isLoading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Support Hours */}
          <div className={componentClasses.formContainer}>
            <h3 className={componentClasses.cardTitle}>Support Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Monday - Friday</span>
                <span className="text-white font-medium">9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Saturday</span>
                <span className="text-white font-medium">10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Sunday</span>
                <span className="text-white font-medium">Closed</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
              <p className="text-sm text-blue-300">
                <strong>Emergency Support:</strong> For critical issues affecting your projects, please mark your message as "High Priority" and we'll respond within 2 hours during business hours.
              </p>
            </div>
          </div>

          {/* Contact Methods */}
          <div className={componentClasses.formContainer}>
            <h3 className={componentClasses.cardTitle}>Other Ways to Reach Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Email Support</p>
                  <p className="text-white/60 text-sm">support@selerim.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <PhoneIcon className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Phone Support</p>
                  <p className="text-white/60 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Live Chat</p>
                  <p className="text-white/60 text-sm">Available during business hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className={componentClasses.formContainer}>
            <h3 className={componentClasses.cardTitle}>Quick Help</h3>
            <p className="text-white/60 mb-4">
              Check our frequently asked questions for quick answers to common questions.
            </p>
            <button className={componentClasses.secondaryButton}>
              View FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 