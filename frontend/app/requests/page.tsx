'use client'

import { useState, useEffect } from 'react'

interface DSARRequest {
  id: number
  subject_email: string
  request_type: string
  status: string
  created_at: string
  due_date: string
  description?: string
}

export default function Requests() {
  const [requests, setRequests] = useState<DSARRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/v1/requests/')
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter
    const matchesSearch = request.subject_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'verifying': return 'text-yellow-600 bg-yellow-100'
      case 'discovering': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">DSAR Requests</h1>
        <button className="btn-primary">
          + New Request
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email or type..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input-field"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="verifying">Verifying</option>
              <option value="discovering">Discovering</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const daysLeft = getDaysRemaining(request.due_date)
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.subject_email}
                      </div>
                      {request.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {request.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.request_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {daysLeft < 0 ? 'Overdue' : `${daysLeft} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          View
                        </button>
                        {request.status === 'new' && (
                          <button className="text-green-600 hover:text-green-900">
                            Process
                          </button>
                        )}
                        {request.status === 'completed' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            Download
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No DSAR requests found</div>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first request to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredRequests.length}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredRequests.filter(r => getDaysRemaining(r.due_date) < 7 && getDaysRemaining(r.due_date) >= 0).length}
            </div>
            <div className="text-sm text-gray-600">Due Soon (&lt;7 days)</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {filteredRequests.filter(r => getDaysRemaining(r.due_date) < 0).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  )
}



