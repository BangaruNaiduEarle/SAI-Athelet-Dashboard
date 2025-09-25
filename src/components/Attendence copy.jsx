import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { User, Calendar, Check, X, Users, TrendingUp, Activity, ChevronLeft, ChevronRight, Save, Filter, Download, UserCheck, AlertCircle, Heart, Sun, Moon } from 'lucide-react';
import { getAtData } from '../utils/utils';
import { getAthletes } from '../utils/storage';

// Mock data for demonstration - replace with actual data from your storage
const mockAthletes = [
  {
    KIUID: "KIA001",
    "Athlete name": "John Doe",
    "NCOE/KIA": "NCOE",
    "ATHLETE PHOTO": null,
    "SR NO": 1,
    Age: 22,
    "Total Points": 85
  },
  {
    KIUID: "KIA002",
    "Athlete name": "Jane Smith",
    "NCOE/KIA": "KIA",
    "ATHLETE PHOTO": null,
    "SR NO": 2,
    Age: 24,
    "Total Points": 92
  },
  {
    KIUID: "KIA003",
    "Athlete name": "Mike Johnson",
    "NCOE/KIA": "NCOE",
    "ATHLETE PHOTO": null,
    "SR NO": 3,
    Age: 21,
    "Total Points": 78
  }
];

// Mock attendance data with morning and evening sessions
const generateMockAttendanceData = () => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    mockAthletes.forEach(athlete => {
      // Morning session
      const morningStatus = Math.random();
      let morningStatusValue;
      if (morningStatus < 0.7) morningStatusValue = 'present';
      else if (morningStatus < 0.9) morningStatusValue = 'absent';
      else morningStatusValue = 'injury';

      data.push({
        date: dateStr,
        KIUID: athlete.KIUID,
        status: morningStatusValue,
        session: 'morning'
      });

      // Evening session
      const eveningStatus = Math.random();
      let eveningStatusValue;
      if (eveningStatus < 0.7) eveningStatusValue = 'present';
      else if (eveningStatus < 0.9) eveningStatusValue = 'absent';
      else eveningStatusValue = 'injury';

      data.push({
        date: dateStr,
        KIUID: athlete.KIUID,
        status: eveningStatusValue,
        session: 'evening'
      });
    });
  }
  return data;
};

export function AthleteAttendance() {
  const [athletes, setAthletes] = useState(mockAthletes);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState('both'); // morning, evening, both
  const [filterNCOE, setFilterNCOE] = useState('all');

  const [atData, setAtData] = useState([]);
  const [athletesData, setAthletesData] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    // Initialize with mock data
    // const mockData = generateMockAttendanceData();
    // setAttendanceData(mockData);


    async function athletesData() {
      setLoading(true);
      const loadedAthletes = await getAthletes();
      setAthletesData(loadedAthletes);
      console.log("Atheltes Data === ", loadedAthletes)
      setLoading(false);
    }
    athletesData();

    async function atData() {
      setLoading(true);
      const athletesAttd = await getAtData();
      console.log("Attendence Data === ", athletesAttd.slice(0, 40))
      setAtData(athletesAttd.slice(0, 40));

      setLoading(false);
    }
    atData();

    
  }, []);

  // Get unique NCOEs for filter
  // const ncoeList = [...new Set(athletes.map(athlete => athlete["NCOE/KIA"]))];

  // const ncoeList = athletesData?.filter(each => each["NCOE/KIA"] === "NCOE")
  // const kiaList = athletesData?.filter(each => each["NCOE/KIA"] === "KIA")
   
  // console.log("NOCe", ncoeList )
  // console.log("KIA", kiaList )


  // Filter athletes based on NCOE selection
  const filteredAthletes = filterNCOE === 'all'
    ? athletes
    : athletes.filter(athlete => athlete["NCOE/KIA"] === filterNCOE);

  // Get attendance for selected date and session
  const getSessionAttendance = (date, session) => {
    return filteredAthletes.map(athlete => {
      const morningAttendance = attendanceData.find(
        record => record.date === date && record.KIUID === athlete.KIUID && record.session === 'morning'
      );
      const eveningAttendance = attendanceData.find(
        record => record.date === date && record.KIUID === athlete.KIUID && record.session === 'evening'
      );

      return {
        ...athlete,
        morningStatus: morningAttendance ? morningAttendance.status : 'unmarked',
        eveningStatus: eveningAttendance ? eveningAttendance.status : 'unmarked'
      };
    });
  };

  // Mark attendance for specific session
  const markAttendance = (kiuid, status, session) => {
    setAttendanceData(prev => {
      const existing = prev.findIndex(
        record => record.date === selectedDate && record.KIUID === kiuid && record.session === session
      );

      const newRecord = {
        date: selectedDate,
        KIUID: kiuid,
        status,
        session
      };

      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = newRecord;
        return updated;
      } else {
        return [...prev, newRecord];
      }
    });
  };

  // Get chart data for attendance trends
  const getChartData = () => {
    const last30Days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayAttendance = attendanceData.filter(record =>
        record.date === dateStr &&
        (filterNCOE === 'all' || athletes.find(a => a.KIUID === record.KIUID && a["NCOE/KIA"] === filterNCOE))
      );

      const morningRecords = dayAttendance.filter(record => record.session === 'morning');
      const eveningRecords = dayAttendance.filter(record => record.session === 'evening');

      const morningPresent = morningRecords.filter(record => record.status === 'present').length;
      const morningAbsent = morningRecords.filter(record => record.status === 'absent').length;
      const morningInjury = morningRecords.filter(record => record.status === 'injury').length;

      const eveningPresent = eveningRecords.filter(record => record.status === 'present').length;
      const eveningAbsent = eveningRecords.filter(record => record.status === 'absent').length;
      const eveningInjury = eveningRecords.filter(record => record.status === 'injury').length;

      const totalSessions = filteredAthletes.length * 2; // 2 sessions per athlete
      const totalPresent = morningPresent + eveningPresent;

      last30Days.push({
        date: dateStr,
        morningPresent,
        morningAbsent,
        morningInjury,
        eveningPresent,
        eveningAbsent,
        eveningInjury,
        totalPresent,
        percentage: totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0
      });
    }

    return last30Days;
  };

  // Get overall attendance statistics
  const getAttendanceStats = () => {
    const totalRecords = attendanceData.filter(record =>
      filterNCOE === 'all' || athletes.find(a => a.KIUID === record.KIUID && a["NCOE/KIA"] === filterNCOE)
    );

    const present = totalRecords.filter(record => record.status === 'present').length;
    const absent = totalRecords.filter(record => record.status === 'absent').length;
    const injury = totalRecords.filter(record => record.status === 'injury').length;
    const total = present + absent + injury;

    return {
      totalSessions: total,
      presentSessions: present,
      absentSessions: absent,
      injurySessions: injury,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
      injuryRate: total > 0 ? Math.round((injury / total) * 100) : 0
    };
  };

  const sessionAttendance = getSessionAttendance(selectedDate);
  const chartData = getChartData();
  const stats = getAttendanceStats();

  // Pie chart data for attendance distribution
  const pieData = [
    { name: 'Present', value: stats.presentSessions, color: '#10B981' },
    { name: 'Absent', value: stats.absentSessions, color: '#EF4444' },
    { name: 'Injury', value: stats.injurySessions, color: '#F59E0B' }
  ];

  // Status button component
  const StatusButton = ({ status, currentStatus, onClick, session, icon: Icon, color, label }) => {
    const isActive = currentStatus === status;
    return (
      <button
        onClick={() => onClick(status, session)}
        className={`px-3 py-2 rounded-lg font-medium text-xs transition-colors ${isActive
          ? `${color.bg} ${color.text} border-2 ${color.border}`
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        <Icon className="w-3 h-3 inline mr-1" />
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Athlete Sparring Attendance</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* NCOE Filter */}
            <div className="min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by NCOE/KIA</label>
              <select
                value={filterNCOE}
                onChange={(e) => setFilterNCOE(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All NCOE/KIA</option>
                {ncoeList.map(ncoe => (
                  <option key={ncoe} value={ncoe}>{ncoe}</option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div className="min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{filteredAthletes.length}</p>
              <p className="text-gray-600">Total Athletes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Check className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.presentSessions}</p>
              <p className="text-gray-600">Present Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <X className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.absentSessions}</p>
              <p className="text-gray-600">Absent Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.injurySessions}</p>
              <p className="text-gray-600">Injury Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              <p className="text-gray-600">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Daily Attendance Marking */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex-col md:flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Sparring Attendance - {new Date(selectedDate).toLocaleDateString()}
              </h3>
              <div className="text-sm text-gray-600 flex items-center space-x-4">
                <span className="flex items-center">
                  <Sun className="w-4 h-4 mr-1 text-yellow-500" />
                  Morning Sessions
                </span>
                <span className="flex items-center">
                  <Moon className="w-4 h-4 mr-1 text-blue-500" />
                  Evening Sessions
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {sessionAttendance.map(athlete => (
                <div key={athlete.KIUID} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {athlete["ATHLETE PHOTO"] ? (
                        <img
                          src={athlete["ATHLETE PHOTO"]}
                          alt={athlete["Athlete name"]}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{athlete["Athlete name"]}</p>
                        <p className="text-sm text-gray-600">{athlete["NCOE/KIA"]} • KIUID: {athlete.KIUID}</p>
                      </div>
                    </div>
                  </div>

                  {/* Morning Session */}
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="">
                      <div className="flex items-center">
                        <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="font-medium text-gray-900">Morning Sparring</span>
                      </div>

                      <div className="flex items-center space-x-2 ">
                        <StatusButton
                          status="present"
                          currentStatus={athlete.morningStatus}
                          onClick={(status) => markAttendance(athlete.KIUID, status, 'morning')}
                          icon={Check}
                          color={{
                            bg: 'bg-green-100',
                            text: 'text-green-800',
                            border: 'border-green-300'
                          }}
                          label="Present"
                        />

                        <StatusButton
                          status="absent"
                          currentStatus={athlete.morningStatus}
                          onClick={(status) => markAttendance(athlete.KIUID, status, 'morning')}
                          icon={X}
                          color={{
                            bg: 'bg-red-100',
                            text: 'text-red-800',
                            border: 'border-red-300'
                          }}
                          label="Absent"
                        />

                        <StatusButton
                          status="injury"
                          currentStatus={athlete.morningStatus}
                          onClick={(status) => markAttendance(athlete.KIUID, status, 'morning')}
                          icon={Heart}
                          color={{
                            bg: 'bg-yellow-100',
                            text: 'text-yellow-800',
                            border: 'border-yellow-300'
                          }}
                          label="Injury"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Evening Session */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex-col  items-center justify-between">
                      <div className="flex items-center">
                        <Moon className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">Evening Sparring</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <StatusButton
                          status="present"
                          currentStatus={athlete.eveningStatus}
                          onClick={(status) => markAttendance(athlete.KIUID, status, 'evening')}
                          icon={Check}
                          color={{
                            bg: 'bg-green-100',
                            text: 'text-green-800',
                            border: 'border-green-300'
                          }}
                          label="Present"
                        />

                        <StatusButton
                          status="absent"
                          currentStatus={athlete.eveningStatus}
                          onClick={(status) => markAttendance(athlete.KIUID, status, 'evening')}
                          icon={X}
                          color={{
                            bg: 'bg-red-100',
                            text: 'text-red-800',
                            border: 'border-red-300'
                          }}
                          label="Absent"
                        />

                        <StatusButton
                          status="injury"
                          currentStatus={athlete.eveningStatus}
                          onClick={(status) => markAttendance(athlete.KIUID, status, 'evening')}
                          icon={Heart}
                          color={{
                            bg: 'bg-yellow-100',
                            text: 'text-yellow-800',
                            border: 'border-yellow-300'
                          }}
                          label="Injury"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sessionAttendance.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No athletes found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Charts and Analytics */}
        <div className="space-y-6">
          {/* Attendance Distribution Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900">Overall Session Distribution</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Today's Session Summary</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="font-medium text-gray-900 mb-2 flex items-center">
                    <Sun className="w-4 h-4 mr-1 text-yellow-500" />
                    Morning
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Present:</span>
                      <span className="font-medium text-green-600">
                        {sessionAttendance.filter(a => a.morningStatus === 'present').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Absent:</span>
                      <span className="font-medium text-red-600">
                        {sessionAttendance.filter(a => a.morningStatus === 'absent').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Injury:</span>
                      <span className="font-medium text-yellow-600">
                        {sessionAttendance.filter(a => a.morningStatus === 'injury').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium text-gray-900 mb-2 flex items-center">
                    <Moon className="w-4 h-4 mr-1 text-blue-500" />
                    Evening
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Present:</span>
                      <span className="font-medium text-green-600">
                        {sessionAttendance.filter(a => a.eveningStatus === 'present').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Absent:</span>
                      <span className="font-medium text-red-600">
                        {sessionAttendance.filter(a => a.eveningStatus === 'absent').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Injury:</span>
                      <span className="font-medium text-yellow-600">
                        {sessionAttendance.filter(a => a.eveningStatus === 'injury').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overall Attendance Rate:</span>
                <span className="font-bold text-blue-600">
                  {sessionAttendance.length > 0
                    ? Math.round(((
                      sessionAttendance.filter(a => a.morningStatus === 'present').length +
                      sessionAttendance.filter(a => a.eveningStatus === 'present').length
                    ) / (sessionAttendance.length * 2)) * 100)
                    : 0}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Injury Rate:</span>
                <span className="font-bold text-yellow-600">
                  {sessionAttendance.length > 0
                    ? Math.round(((
                      sessionAttendance.filter(a => a.morningStatus === 'injury').length +
                      sessionAttendance.filter(a => a.eveningStatus === 'injury').length
                    ) / (sessionAttendance.length * 2)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Comparison Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex-col md:flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">30-Day Session Comparison</h3>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Injury</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Bar dataKey="morningPresent" fill="#10B981" name="Morning Present" />
              <Bar dataKey="eveningPresent" fill="#059669" name="Evening Present" />
              <Bar dataKey="morningAbsent" fill="#EF4444" name="Morning Absent" />
              <Bar dataKey="eveningAbsent" fill="#DC2626" name="Evening Absent" />
              <Bar dataKey="morningInjury" fill="#F59E0B" name="Morning Injury" />
              <Bar dataKey="eveningInjury" fill="#D97706" name="Evening Injury" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}