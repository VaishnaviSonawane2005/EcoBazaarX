import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { adminService } from '../../services/adminService';
import { Mail, Building, FileText, Calendar, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await adminService.getSellerApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (decision) => {
    if (!selectedApp) return;

    setReviewing(true);
    try {
      await adminService.reviewSellerApplication(selectedApp.id, decision, reviewNotes);
      setApplications(
        applications.map((app) =>
          app.id === selectedApp.id ? { ...app, status: decision } : app
        )
      );
      toast.success(`Application ${decision.toLowerCase()} successfully`);
      setSelectedApp(null);
      setReviewNotes('');
    } catch (error) {
      toast.error('Failed to review application');
    } finally {
      setReviewing(false);
    }
  };

  const pendingApps = applications.filter((app) => app.status === 'PENDING');
  const reviewedApps = applications.filter((app) => app.status !== 'PENDING');

  if (loading) {
    return <div className="p-6">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Seller Applications</h2>
        <p className="text-gray-600 mt-2">Review and approve seller applications</p>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pending Applications
            <Badge className="bg-amber-100 text-amber-800">{pendingApps.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4>{app.userName}</h4>
                    <Badge className="bg-amber-100 text-amber-800">PENDING</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {app.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {app.businessName}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {app.businessType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setSelectedApp(app)} variant="outline">
                  Review
                </Button>
              </div>
            ))}

            {pendingApps.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No pending applications
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviewed Applications */}
      {reviewedApps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reviewed Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewedApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{app.userName}</h4>
                      <Badge
                        className={
                          app.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {app.businessName} - {app.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Seller Application</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Applicant Name</label>
                  <p>{selectedApp.userName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p>{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Business Name</label>
                  <p>{selectedApp.businessName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Business Type</label>
                  <p>{selectedApp.businessType}</p>
                </div>
                {selectedApp.gstNumber && (
                  <div>
                    <label className="text-sm text-gray-600">GST Number</label>
                    <p>{selectedApp.gstNumber}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600">Applied Date</label>
                  <p>{new Date(selectedApp.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Documents</label>
                <div className="flex gap-2">
                  {selectedApp.documents.map((doc, idx) => (
                    <Badge key={idx} variant="outline">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Review Notes</label>
                <Textarea
                  placeholder="Add any notes about this application..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleReview('APPROVED')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={reviewing}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReview('REJECTED')}
                  variant="destructive"
                  className="flex-1"
                  disabled={reviewing}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
