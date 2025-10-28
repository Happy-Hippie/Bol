import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { Card } from '../Card';
import { Modal } from '../Modal';
import { FileUpload } from '../FileUpload';

interface Funder {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  logo_url: string | null;
  relationship_status: string;
}

export function Funders() {
  const { user } = useAuth();
  const [funders, setFunders] = useState<Funder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFunder, setEditingFunder] = useState<Funder | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    contact_email: '',
    logo_url: '',
    relationship_status: 'active',
  });

  useEffect(() => {
    loadFunders();
  }, [user]);

  const loadFunders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('funders')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setFunders(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (funder?: Funder) => {
    if (funder) {
      setEditingFunder(funder);
      setFormData({
        name: funder.name,
        contact_name: funder.contact_name || '',
        contact_email: funder.contact_email || '',
        logo_url: funder.logo_url || '',
        relationship_status: funder.relationship_status,
      });
    } else {
      setEditingFunder(null);
      setFormData({
        name: '',
        contact_name: '',
        contact_email: '',
        logo_url: '',
        relationship_status: 'active',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!user) return;

    const funderData = {
      org_id: user.id,
      name: formData.name,
      contact_name: formData.contact_name || null,
      contact_email: formData.contact_email || null,
      logo_url: formData.logo_url || null,
      relationship_status: formData.relationship_status,
    };

    if (editingFunder) {
      await supabase
        .from('funders')
        .update({ ...funderData, updated_at: new Date().toISOString() })
        .eq('id', editingFunder.id);
    } else {
      await supabase.from('funders').insert(funderData);
    }

    setShowModal(false);
    loadFunders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this funder?')) return;
    await supabase.from('funders').delete().eq('id', id);
    loadFunders();
  };

  const handleLogoUpload = (file: File) => {
    const fakeUrl = `https://via.placeholder.com/150?text=${encodeURIComponent(formData.name || 'Logo')}`;
    setFormData({ ...formData, logo_url: fakeUrl });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your funding partners</p>
        <Button variant="gradient" onClick={() => handleOpenModal()}>
          <Plus size={20} className="inline mr-2" />
          Add Funder
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : funders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No funders yet. Add your first funding partner!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {funders.map((funder) => (
            <Card key={funder.id} borderColor="pink">
              <div className="flex flex-col h-full">
                {funder.logo_url ? (
                  <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-bol-pink/10 to-bol-orange/10 flex items-center justify-center border-2 border-bol-pink/20">
                    <img
                      src={funder.logo_url}
                      alt={funder.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 mb-4 rounded-lg bg-gradient-to-br from-bol-purple/10 to-bol-pink/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-bol-purple">
                      {funder.name.charAt(0)}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold text-bol-purple mb-2">{funder.name}</h3>

                {funder.contact_name && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Contact:</span> {funder.contact_name}
                  </p>
                )}

                {funder.contact_email && (
                  <p className="text-sm text-gray-600 mb-3 truncate" title={funder.contact_email}>
                    {funder.contact_email}
                  </p>
                )}

                <div className="mt-auto flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenModal(funder)}
                    className="flex-1 py-2 text-sm text-bol-blue hover:bg-bol-blue hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Edit2 size={16} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(funder.id)}
                    className="flex-1 py-2 text-sm text-bol-pink hover:bg-bol-pink hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={16} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingFunder ? 'Edit Funder' : 'Add New Funder'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-bol-purple font-medium mb-2">Funder Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              placeholder="Funder name"
            />
          </div>

          <div>
            <label className="block text-bol-purple font-medium mb-2">Logo</label>
            {formData.logo_url && (
              <div className="mb-3">
                <img
                  src={formData.logo_url}
                  alt="Funder logo"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-bol-purple/20"
                />
              </div>
            )}
            <FileUpload
              onFileSelect={handleLogoUpload}
              accept="image/*"
              label="Upload Funder Logo"
            />
          </div>

          <div>
            <label className="block text-bol-purple font-medium mb-2">Contact Name</label>
            <input
              type="text"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              placeholder="Contact person"
            />
          </div>

          <div>
            <label className="block text-bol-purple font-medium mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              placeholder="contact@funder.org"
            />
          </div>

          <div>
            <label className="block text-bol-purple font-medium mb-2">Relationship Status</label>
            <select
              value={formData.relationship_status}
              onChange={(e) => setFormData({ ...formData, relationship_status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="prospective">Prospective</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              {editingFunder ? 'Update' : 'Add'} Funder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
