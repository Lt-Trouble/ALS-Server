// app/stats/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";    
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile & Stats",
  description: "View your profile and quiz statistics",
};

// Static sample data
const sampleStats = {
  totalAttempts: 12,
  averageScore: 78.5,
  quizzesCompleted: 5,
  categoryStats: [
    {
      categoryId: "1",
      categoryName: "Mathematics",
      attempts: 4,
      averageScore: 82.5,
      lastAttempt: "2023-11-15T14:30:00Z"
    },
    {
      categoryId: "2",
      categoryName: "Science",
      attempts: 3,
      averageScore: 75.0,
      lastAttempt: "2023-11-10T09:15:00Z"
    },
    {
      categoryId: "3",
      categoryName: "History",
      attempts: 2,
      averageScore: 65.0,
      lastAttempt: "2023-10-28T16:45:00Z"
    },
    {
      categoryId: "4",
      categoryName: "English",
      attempts: 3,
      averageScore: 85.0,
      lastAttempt: "2023-11-12T11:20:00Z"
    }
  ],
  recentAttempts: [
    {
      id: "1",
      quizTitle: "Algebra Basics",
      categoryName: "Mathematics",
      score: 85,
      createdAt: "2023-11-15T14:30:00Z"
    },
    {
      id: "2",
      quizTitle: "Chemical Reactions",
      categoryName: "Science",
      score: 70,
      createdAt: "2023-11-10T09:15:00Z"
    },
    {
      id: "3",
      quizTitle: "World War II",
      categoryName: "History",
      score: 65,
      createdAt: "2023-10-28T16:45:00Z"
    },
    {
      id: "4",
      quizTitle: "Grammar Test",
      categoryName: "English",
      score: 90,
      createdAt: "2023-11-12T11:20:00Z"
    },
    {
      id: "5",
      quizTitle: "Geometry Quiz",
      categoryName: "Mathematics",
      score: 80,
      createdAt: "2023-11-05T13:10:00Z"
    }
  ]
};

export default async function StatsPage() {
  const user: User | null = await currentUser();

  if (!user) {
    return <div className="max-w-4xl mx-auto p-6 text-center">Please sign in to view your profile</div>;
  }

  // Try to fetch user stats from the database, fall back to sample data
  let stats = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/stats?clerkId=${user.id}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      stats = await response.json();
    } else {
      stats = sampleStats;
    }
  } catch (error) {
    console.error("Failed to fetch user stats, using sample data:", error);
    stats = sampleStats;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile & Statistics</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Section */}
        <div className="md:w-1/3 space-y-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 mx-auto">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-500">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500">Display Name</h2>
              <p className="mt-1 text-lg font-semibold">
                {user.username || `${user.firstName} ${user.lastName}`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500">Email</h2>
              <p className="mt-1 text-lg font-semibold">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500">Account Created</h2>
              <p className="mt-1 text-lg font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="md:w-2/3 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Statistics</h2>
          
          {stats ? (
            <>
              {/* Overall Stats */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Overall Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Total Attempts</p>
                    <p className="text-xl font-bold">{stats.totalAttempts}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-xl font-bold">{stats.averageScore?.toFixed(1) || '0'}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Quizzes Completed</p>
                    <p className="text-xl font-bold">{stats.quizzesCompleted}</p>
                  </div>
                </div>
              </div>

              {/* Category Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Performance by Category</h3>
                {stats.categoryStats?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.categoryStats.map((category: any) => (
                      <div key={category.categoryId} className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{category.categoryName}</h4>
                          <span className="text-sm text-gray-500">{category.attempts} attempts</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${category.averageScore || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium">
                            {category.averageScore?.toFixed(1) || '0'}%
                          </span>
                        </div>
                        {category.lastAttempt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Last attempted: {new Date(category.lastAttempt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No category statistics available yet.</p>
                )}
              </div>

              {/* Recent Attempts */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Recent Quiz Attempts</h3>
                {stats.recentAttempts?.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentAttempts.map((attempt: any) => (
                      <div key={attempt.id} className="bg-white p-3 rounded-lg shadow-sm border flex justify-between items-center">
                        <div>
                          <p className="font-medium">{attempt.quizTitle}</p>
                          <p className="text-sm text-gray-500">{attempt.categoryName}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            attempt.score >= 80 ? 'text-green-600' :
                            attempt.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {attempt.score}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(attempt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent quiz attempts.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Loading statistics...</p>
          )}
        </div>
      </div>
    </div>
  );
}