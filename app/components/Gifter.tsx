'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EmailFormData {
  to: string;
  subject: string;
  message: string;
}

export default function GiftEmailForm() {
  const [formData, setFormData] = useState<EmailFormData>({
    to: 'samuel.v.soriano@gmail.com',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionAttempt, setSubmissionAttempt] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check local storage on component mount to see if user already submitted
  useEffect(() => {
    const alreadySubmitted = localStorage.getItem('featureRequestSubmitted');
    if (alreadySubmitted === 'true') {
      setHasSubmitted(true);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    // Open confirmation dialog instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsLoading(true);
    setSubmissionAttempt(prev => prev + 1);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Request Sent!", {
          description: "Your website request has been submitted successfully.",
        });
        // Mark as submitted in local storage
        localStorage.setItem('featureRequestSubmitted', 'true');
        setHasSubmitted(true);
        
        // Reset form
        setFormData({
          to: 'samuel.v.soriano@gmail.com',
          subject: '',
          message: ''
        });
      } else if (data.alreadySent) {
        // Handle the already sent case
        toast.error("Already Submitted", {
          description: "You have already submitted a feature request.",
        });
        localStorage.setItem('featureRequestSubmitted', 'true');
        setHasSubmitted(true);
      } else {
        throw new Error(data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error("Error", {
        description: "Failed to send your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  if (hasSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Request Submitted</AlertTitle>
          <AlertDescription className="text-green-700">
            Thank you for your feature request! We only allow one submission per user to ensure we focus on quality feedback.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {submissionAttempt > 0 && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">One submission only</AlertTitle>
          <AlertDescription className="text-blue-700">
            Please note that you can only submit one feature request.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmitClick} className="space-y-4">

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Your Email
          </label>
          <Input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter your email" required />
        </div>
        

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Website Details
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe the website you'd like to see..."
            required
            className="w-full min-h-[150px]"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can only submit one request for the voucher, so please be detailed.
          </p>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Claim Voucher'}
        </Button>
      </form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Voucher Claim</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to claim your voucher? Remember, you can only submit one request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedSubmit}>
              Yes, Claim Voucher
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}