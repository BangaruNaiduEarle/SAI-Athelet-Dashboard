import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, Target, Dumbbell, Award, Users, Activity, AlertCircle 
} from 'lucide-react';
import { submitAthleteData } from '../utils/utils';

export const AthleteForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // ✅ Final working onSubmit (Google Sheets version)
  const onSubmit = async (data) => {

    console.log("Formmm===",data)

    setIsSubmitting(true);
    try {
      const result = await submitAthleteData(data);
      console.log("Google Sheets Response:", result);

      setSubmitSuccess(true);
      // reset();

      // Auto-hide success message and trigger callback
      setTimeout(() => {
        setSubmitSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Error saving athlete:", error);
      alert("❌ Failed to save data to Google Sheets");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-accent-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Athlete Data Successfully Stored ✅
          </h3>
          <p className="text-gray-600">
            Data has been saved to your Google Sheet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <User className="w-8 h-8 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Add New Athlete</h2>
        </div>

        {/* ✅ Hook up onSubmit here */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KIUID *
                </label>
                <input
                  {...register('KIUID', { required: 'KIUID is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter KIUID"
                />
                {errors.kiuid && (
                  <p className="mt-1 text-sm text-red-600">{errors.kiuid.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Athlete Name *
                </label>
                <input
                  {...register('Athlete name', { required: 'Name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Athlete Photo URL
                </label>
                <input
                  {...register('ATHLETE PHOTO')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter photo URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  {...register('WT', { 
                    required: 'Weight is required',
                    min: { value: 30, message: 'Weight must be at least 30kg' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter weight"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  {...register('DOB', { required: 'Date of birth is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.dob && (
                  <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth (Bengali)
                </label>
                <input
                  {...register('DOBB')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter Bengali date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Joining NCOE *
                </label>
                <input
                  type="date"
                  {...register('Date of Joining in NCOE', { required: 'Joining date is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.dateOfJoiningNCOE && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfJoiningNCOE.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  {...register('Age', { 
                    required: 'Age is required',
                    min: { value: 10, message: 'Age must be at least 10' },
                    max: { value: 50, message: 'Age must be less than 50' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NCOE/KIA *
                </label>
                <select
                  {...register('NCOE/KIA', { required: 'NCOE/KIA selection is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select NCOE/KIA</option>
                  <option value="NCOE">NCOE</option>
                  <option value="KIA">KIA</option>
                </select>
                {errors.ncoeKia && (
                  <p className="mt-1 text-sm text-red-600">{errors.ncoeKia.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Performance & Achievements */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Performance & Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements Before Joining NCOE/KIA
                </label>
                <textarea
                  {...register('ACHIVEMENTS Before THE JOINING NCOE /KIA')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="List achievements before joining..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance (Last 3 years National & International) After Joining
                </label>
                <textarea
                  {...register('Performance')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="List performance after joining..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Points *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('Total Points', { 
                    required: 'Total points is required',
                    min: { value: 0, message: 'Points must be 0 or higher' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter total points"
                />
                {errors.totalPoints && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalPoints.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Targets */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Targets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Term Target
                </label>
                <textarea
                  {...register('Short_Term_Target')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter short term targets..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Term Target
                </label>
                <textarea
                  {...register('Long_Term_Target')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter long term targets..."
                />
              </div>
            </div>
          </div>

          {/* Coach Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Coach Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Issued Warning
                </label>
                <input
                  type="date"
                  {...register('Date of issued warning ')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks of Mapped Coach
                </label>
                <textarea
                  {...register('REMARKS OF MAPED COACH')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter coach remarks..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name & Signature of Coach
                </label>
                <input
                  {...register('NAME & SIGNATURE OF COACH')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter coach name"
                />
              </div>
            </div>
          </div>

          {/* Support Staff */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Support Staff & Specialists
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  S&C (Strength & Conditioning)
                </label>
                <input
                  {...register('S&C')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="S&C specialist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physiotherapist
                </label>
                <input
                  {...register('PHYSIOTHERAPIST')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Physiotherapist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Psychology
                </label>
                <input
                  {...register('PSYCHOLOGY')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Sports psychologist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physiology
                </label>
                <input
                  {...register('PHYSIOLOGY')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Physiologist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anthropometry
                </label>
                <input
                  {...register('ANTHROPOMETRY')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Anthropometry specialist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nutrition
                </label>
                <input
                  {...register('NUTRITION')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nutritionist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biomechanics
                </label>
                <input
                  {...register('BIOMECHANICS')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Biomechanics specialist name"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving to Google Sheets...
                </>
              ) : (
                <>
                  <Dumbbell className="w-5 h-5 mr-2" />
                  Add Athlete
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-primary-500 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-primary-800">
              <p className="font-medium mb-1">Google Sheets Integration</p>
              <p>
                This demo saves data via Google Sheets API. 
                Make sure you configure API credentials correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
