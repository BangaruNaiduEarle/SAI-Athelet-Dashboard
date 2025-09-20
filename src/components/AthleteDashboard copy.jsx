import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { User, Calendar, MapPin, Heart, Target, TrendingUp, Award, AlertTriangle, Users, Activity } from 'lucide-react';
import { getAthletes } from '../utils/storage';

export const AthleteDashboard = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  useEffect(() => {
    async function athletesData() {
      const loadedAthletes = await getAthletes();
      setAthletes(loadedAthletes);
      if (loadedAthletes.length > 0) {
        setSelectedAthlete(loadedAthletes[0]);
      }
    }
    athletesData();
  }, []);

  const handleAthleteSelect = (athleteId) => {
    const athlete = athletes.find(a => a.id === athleteId);
    setSelectedAthlete(athlete || null);
  };

  const getPerformanceData = (athlete) => {
    // Create sample performance data based on total points
    const baseScore = athlete["Total Point"] || 0;
    return [
      { session: 'Q1', score: Math.max(0, baseScore - 10 + Math.random() * 5) },
      { session: 'Q2', score: Math.max(0, baseScore - 5 + Math.random() * 5) },
      { session: 'Q3', score: Math.max(0, baseScore + Math.random() * 5) },
      { session: 'Current', score: baseScore },
    ];
  };

  if (athletes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Athletes Found</h3>
          <p className="text-gray-600">Add some athletes first to view their dashboards.</p>
        </div>
      </div>
    );
  }


  console.log('athletes Data == ', athletes)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Athlete Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Athlete Dashboard</h2>
          </div>

          <div className="min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Athlete
            </label>
            <select
              value={selectedAthlete?.KIUID || ''}
              onChange={(e) => handleAthleteSelect(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {athletes?.map(athlete => (
                <option key={athlete.KIUID} value={athlete.KIUID}>
                  {athlete["Athlete name"]} - {athlete["NCOE/KIA"]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedAthlete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile and Key Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                {selectedAthlete.athletePhoto ? (
                  <img
                    src={selectedAthlete.athletePhoto}
                    alt={selectedAthlete.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAthlete.name}</h3>
                  <p className="text-gray-600">{selectedAthlete.ncoeKia} • KIUID: {selectedAthlete.kiuid}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">SR No:</span>
                  <span className="font-medium">{selectedAthlete.srNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{selectedAthlete.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium">{new Date(selectedAthlete.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{selectedAthlete.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joining Date:</span>
                  <span className="font-medium">{new Date(selectedAthlete.dateOfJoiningNCOE).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-medium text-primary-600">{selectedAthlete.totalPoints}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-yellow-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Achievements</h4>
              </div>

              <div className="space-y-3">
                {selectedAthlete.achievementsBeforeJoining && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Before Joining:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedAthlete.achievementsBeforeJoining}
                    </p>
                  </div>
                )}
                {selectedAthlete.performanceAfterJoining && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">After Joining:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedAthlete.performanceAfterJoining}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Targets */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-primary-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Targets</h4>
              </div>

              <div className="space-y-3">
                {selectedAthlete.shortTermTarget && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Short Term:</h5>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {selectedAthlete.shortTermTarget}
                    </p>
                  </div>
                )}
                {selectedAthlete.longTermTarget && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Long Term:</h5>
                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      {selectedAthlete.longTermTarget}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Information */}
            {selectedAthlete.dateOfIssuedWarning && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Warning Information</h4>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-red-800 font-medium">
                    Warning issued on: {new Date(selectedAthlete.dateOfIssuedWarning).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Charts and Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Trend Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Performance Progress</h4>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getPerformanceData(selectedAthlete)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Support Staff */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Activity className="w-6 h-6 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Support Staff</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'S&C', value: selectedAthlete.sc },
                  { label: 'Physiotherapist', value: selectedAthlete.physiotherapist },
                  { label: 'Psychology', value: selectedAthlete.psychology },
                  { label: 'Physiology', value: selectedAthlete.physiology },
                  { label: 'Anthropometry', value: selectedAthlete.anthropometry },
                  { label: 'Nutrition', value: selectedAthlete.nutrition },
                  { label: 'Biomechanics', value: selectedAthlete.biomechanics }
                ].map((item, index) => (
                  item.value && (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-600">{item.value}</div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Coach Comments */}
            {(selectedAthlete.remarksOfMappedCoach || selectedAthlete.nameAndSignatureOfCoach) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Coach Comments</h4>
                </div>
                <div className="space-y-3">
                  {selectedAthlete.remarksOfMappedCoach && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-blue-900">{selectedAthlete.remarksOfMappedCoach}</p>
                    </div>
                  )}
                  {selectedAthlete.nameAndSignatureOfCoach && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Coach: <span className="font-medium">{selectedAthlete.nameAndSignatureOfCoach}</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};