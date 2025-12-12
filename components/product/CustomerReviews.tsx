"use client";

import { useState } from "react";
import { Star, Camera, X, ThumbsUp, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

interface CustomerReviewsProps {
  productId: string;
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  helpful: number;
}

export default function CustomerReviews({ productId, rating = 0, reviewCount = 0 }: CustomerReviewsProps) {
  const { isAuthenticated, user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock reviews data - in production, fetch from API
  const [reviews] = useState<Review[]>([]);

  // Rating breakdown (mock data - would come from API)
  const ratingBreakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - images.length);
    setImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    if (newRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to submit review
      // const formData = new FormData();
      // formData.append("productId", productId);
      // formData.append("rating", newRating.toString());
      // formData.append("comment", comment);
      // images.forEach((img) => formData.append("images", img));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setNewRating(0);
      setComment("");
      setImages([]);
      setImagePreview([]);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClass = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= count ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Rating Overview */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl min-w-[200px]">
          <span className="text-5xl font-bold text-gray-900">{rating.toFixed(1)}</span>
          <div className="mt-2">{renderStars(Math.round(rating), "md")}</div>
          <span className="mt-2 text-sm text-gray-600">{reviewCount} reviews</span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Button */}
      {!showReviewForm && (
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please login to write a review");
              return;
            }
            setShowReviewForm(true);
          }}
          className="mb-6 px-6 py-3 bg-[#001F5F] hover:bg-[#001845] text-white font-medium rounded-lg transition-colors"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Write Your Review</h4>
            <button
              onClick={() => setShowReviewForm(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Star Rating Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || newRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="flex flex-wrap gap-3">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#001F5F] transition-colors">
                  <Camera className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">You can add up to 5 images</p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900">Customer Reviews</h4>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{review.userName}</span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{review.date}</p>
                  <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16">
                          <Image
                            src={img}
                            alt={`Review image ${i + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
