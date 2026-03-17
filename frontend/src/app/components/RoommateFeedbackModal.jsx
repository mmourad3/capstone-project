//KEEP FOR AI. DONT DELETE



import { useState } from 'react';
import { X, Star, Lock } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function RoommateFeedbackModal({ roommate, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
    endReason: '',
    conflictType: '',
    importantFactor: ''
  });

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async () => {
    if (step === 1 && formData.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2 && !formData.endReason) {
      toast.error('Please select a reason');
      return;
    }

    if (step === 2 && formData.endReason === 'Conflict') {
      setStep(3);
      return;
    }

    if (step === 3 && !formData.conflictType) {
      toast.error('Please select what the conflict was related to');
      return;
    }

    if ((step === 3) || (step === 2 && formData.endReason !== 'Conflict')) {
      setStep(4);
      return;
    }

    if (step === 4 && !formData.importantFactor) {
      toast.error('Please select the most important factor');
      return;
    }

    // Submit feedback
    setIsSubmitting(true);
    try {
      await roommateAPI.submitFeedback(roommate.id, formData);
      toast.success('Thank you for your feedback!');
      onSubmit?.();
      onClose();
    } catch (error) {
      console.log('Backend not available - saving feedback locally');
      // Save to localStorage for demo
      const feedbackHistory = JSON.parse(localStorage.getItem('roommateFeedback') || '[]');
      feedbackHistory.push({
        roommateId: roommate.id,
        roommateName: roommate.name,
        ...formData,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('roommateFeedback', JSON.stringify(feedbackHistory));
      toast.success('Thank you for your feedback!');
      onSubmit?.();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Roommate Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Step {step} of 4</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Rating & Review */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Overall matching rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      ({formData.rating} {formData.rating === 1 ? 'star' : 'stars'})
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Your answers are private and help improve future roommate matching.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: End Reason */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Reason for ending roommate relationship
                </label>
                <div className="space-y-2">
                  {[
                    'Lease ended',
                    'Lifestyle mismatch',
                    'Conflict',
                    'Their profile didn\'t match reality',
                    'Other'
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setFormData({ ...formData, endReason: reason })}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.endReason === reason
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Conflict Type (only if Conflict was selected) */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What was the conflict related to?
                </label>
                <div className="space-y-2">
                  {[
                    'Cleanliness',
                    'Noise',
                    'Guests',
                    'Payments',
                    'Communication',
                    'Other'
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, conflictType: type })}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.conflictType === type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Important Factor */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Most important factor for future roommates
                </label>
                <div className="space-y-2">
                  {[
                    'Cleanliness habits',
                    'Noise tolerance',
                    'Social habits',
                    'Lifestyle habits',
                    'Temperature preference',
                    'Sharing comfort'
                  ].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => setFormData({ ...formData, importantFactor: factor })}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.importantFactor === factor
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {factor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Your answers are private and help improve future roommate matching.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          {step > 1 && (
            <button
              onClick={() => {
                if (step === 4 && formData.endReason !== 'Conflict') {
                  setStep(2);
                } else {
                  setStep(step - 1);
                }
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium"
            >
              Back
            </button>
          )}
          {step === 1 && <div></div>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : step === 4 ? 'Submit Feedback' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}