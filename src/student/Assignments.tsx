import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  FileText,
  ChevronRight,
  AlertCircle,
  ArrowUpRight,
  Send
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Assignment, Submission } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch(`/api/assignments?student_id=${user.id}`).then(res => res.json()).then(setAssignments);
    fetch(`/api/submissions?student_id=${user.id}`).then(res => res.json()).then(setSubmissions);
  }, [user]);

  const getSubmission = (assignmentId: number) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !user) return;

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignment_id: selectedAssignment.id,
        student_id: user.id,
        content
      }),
    });

    if (res.ok) {
      const newSub = await res.json();
      setSubmissions([...submissions, { 
        id: newSub.id, 
        assignment_id: selectedAssignment.id, 
        student_id: user.id, 
        content, 
        submission_date: new Date().toISOString(), 
        status: 'submitted' 
      }]);
      setSelectedAssignment(null);
      setContent('');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assignments</h1>
          <p className="text-slate-500 font-medium mt-1">Track your tasks, deadlines and grades.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <ClipboardList size={18} />
            My Submissions
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search assignments..." 
                  className="w-full bg-[#F1F4F9] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                <Filter size={18} />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {assignments.map((asg) => {
                const submission = getSubmission(asg.id);
                const isOverdue = new Date(asg.deadline) < new Date() && !submission;

                return (
                  <div key={asg.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <FileText size={28} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{asg.title}</h3>
                          <p className="text-xs text-slate-500 font-medium">{asg.subject_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {submission ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Submitted
                          </span>
                        ) : isOverdue ? (
                          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{asg.description}</p>

                    <div className="flex items-center justify-between mt-8">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          <span className="text-xs font-bold">Due: {format(new Date(asg.deadline), 'MMM dd, yyyy')}</span>
                        </div>
                        {submission?.status === 'graded' && (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 size={14} />
                            <span className="text-xs font-bold">Grade: {submission.marks}/{asg.total_marks}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => !submission && setSelectedAssignment(asg)}
                        className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 group/btn"
                      >
                        {submission ? 'View Submission' : 'Submit Now'}
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {selectedAssignment ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-100 sticky top-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Submit Assignment</h2>
              <p className="text-sm text-slate-500 mb-6">You are submitting for: <span className="font-bold text-slate-900">{selectedAssignment.title}</span></p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Submission Content</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#F1F4F9] border-none rounded-2xl py-4 px-5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all min-h-[200px]"
                    placeholder="Paste your submission content or link here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Submit Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 uppercase tracking-widest"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          ) : (
            <>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  Summary
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">Total Assigned</span>
                    <span className="text-lg font-bold text-slate-900">{assignments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">Completed</span>
                    <span className="text-lg font-bold text-emerald-600">{submissions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">Pending</span>
                    <span className="text-lg font-bold text-amber-600">{assignments.length - submissions.length}</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion Rate</span>
                    <span className="text-xs font-bold text-slate-900">{Math.round((submissions.length / assignments.length) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all"
                      style={{ width: `${(submissions.length / assignments.length) * 100 || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <AlertCircle size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Important Note</h3>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                    Late submissions carry a 10% penalty per day. Ensure you upload your work at least 2 hours before the deadline.
                  </p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    Read Policy
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
