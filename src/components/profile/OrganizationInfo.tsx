import { useState, useEffect } from 'react';
import { Save, Info, Globe, FileText, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { LogoUploadSlot } from './LogoUploadSlot';
import { DescriptionEditor } from './DescriptionEditor';
import { INDIAN_STATES, validatePinCode } from '../../utils/indianStates';

export function OrganizationInfo() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pin_code: '',
  });

  const [logos, setLogos] = useState<{
    fullColor: { name: string; url: string; width: number; height: number } | null;
    twoColor: { name: string; url: string; width: number; height: number } | null;
    grayscale: { name: string; url: string; width: number; height: number } | null;
    vertical: { name: string; url: string; width: number; height: number } | null;
    horizontal: { name: string; url: string; width: number; height: number } | null;
  }>({
    fullColor: null,
    twoColor: null,
    grayscale: null,
    vertical: null,
    horizontal: null,
  });

  const [brandGuidelines, setBrandGuidelines] = useState<File | null>(null);

  useEffect(() => {
    loadOrgData();
  }, [user]);

  const loadOrgData = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('organizations')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (!error) {
      alert('Organization info saved successfully!');
    } else {
      alert('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  const handleLogoUpload = (type: keyof typeof logos, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setLogos({
          ...logos,
          [type]: {
            name: file.name,
            url: e.target?.result as string,
            width: img.width,
            height: img.height,
          },
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteLogo = (type: keyof typeof logos) => {
    setLogos({ ...logos, [type]: null });
  };

  const handleGuidelinesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setBrandGuidelines(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-bol-blue p-4 rounded-lg">
        <div className="flex gap-3">
          <Info className="text-bol-blue flex-shrink-0" size={20} />
          <p className="text-sm text-gray-700">
            Uploaded logos will automatically appear on all materials generated through the CRM — including annual reports, press releases, event collaterals, and social media content.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-bol-purple mb-4">Logo Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LogoUploadSlot
            label="Full-Color Logo"
            required
            isPrimary
            onFileSelect={(file) => handleLogoUpload('fullColor', file)}
            currentFile={logos.fullColor}
            onDelete={() => handleDeleteLogo('fullColor')}
          />
          <LogoUploadSlot
            label="Two-Color Logo"
            onFileSelect={(file) => handleLogoUpload('twoColor', file)}
            currentFile={logos.twoColor}
            onDelete={() => handleDeleteLogo('twoColor')}
          />
          <LogoUploadSlot
            label="Grayscale Logo"
            onFileSelect={(file) => handleLogoUpload('grayscale', file)}
            currentFile={logos.grayscale}
            onDelete={() => handleDeleteLogo('grayscale')}
          />
          <LogoUploadSlot
            label="Vertical Format"
            onFileSelect={(file) => handleLogoUpload('vertical', file)}
            currentFile={logos.vertical}
            onDelete={() => handleDeleteLogo('vertical')}
          />
          <LogoUploadSlot
            label="Horizontal Format"
            onFileSelect={(file) => handleLogoUpload('horizontal', file)}
            currentFile={logos.horizontal}
            onDelete={() => handleDeleteLogo('horizontal')}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-bol-purple mb-4">Brand Guidelines</h3>
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-bol-blue transition-colors">
          <div className="flex flex-col items-center justify-center gap-4">
            {brandGuidelines ? (
              <>
                <FileText className="text-bol-blue" size={48} />
                <div className="text-center">
                  <p className="font-medium text-gray-900">{brandGuidelines.name}</p>
                  <p className="text-sm text-gray-500">{(brandGuidelines.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setBrandGuidelines(null)}
                    className="text-sm"
                  >
                    Remove
                  </Button>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleGuidelinesUpload}
                      className="hidden"
                    />
                    <Button variant="outline" className="text-sm" as="span">
                      Replace
                    </Button>
                  </label>
                </div>
              </>
            ) : (
              <>
                <Upload className="text-gray-400" size={48} />
                <div className="text-center">
                  <p className="font-medium text-gray-900 mb-1">Upload Brand Guidelines</p>
                  <p className="text-sm text-gray-500">PDF format only, max 10MB</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleGuidelinesUpload}
                    className="hidden"
                  />
                  <Button variant="gradient" className="text-sm" as="span">
                    Choose File
                  </Button>
                </label>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Upload your organization's brand guidelines document. This helps maintain consistency across all generated materials.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-bol-purple font-medium mb-2">Organization Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
            placeholder="Your Organization Name"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-bol-purple font-medium mb-2">Description</label>
          <DescriptionEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
          />
        </div>

        <div>
          <label className="block text-bol-purple font-medium mb-2">Contact Email</label>
          <input
            type="email"
            value={formData.contact_email || ''}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
            placeholder="contact@organization.org"
          />
        </div>

        <div>
          <label className="block text-bol-purple font-medium mb-2">Contact Phone</label>
          <input
            type="tel"
            value={formData.contact_phone || ''}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
            placeholder="+91"
          />
        </div>

        <div>
          <label className="block text-bol-purple font-medium mb-2">Website</label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
            placeholder="https://yourwebsite.org"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-bol-purple font-medium mb-3">Address</label>
          <p className="text-xs text-gray-500 mb-3">Enter address in standard Indian format</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                value={formData.address_line1 || ''}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                placeholder="Flat/House No., Building Name"
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                value={formData.address_line2 || ''}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                placeholder="Street, Area/Locality"
              />
            </div>
            <div>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                placeholder="City"
              />
            </div>
            <div>
              <select
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors bg-white"
              >
                <option value="">Select State/UT</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={formData.pin_code || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData({ ...formData, pin_code: value });
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                placeholder="PIN Code (000000)"
                maxLength={6}
              />
              {formData.pin_code && !validatePinCode(formData.pin_code) && (
                <p className="text-xs text-red-500 mt-1">PIN code must be 6 digits</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-bol-blue/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-bol-purple mb-4 flex items-center gap-2">
          <Globe size={24} />
          Localization Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Currency
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="INR ₹"
                disabled
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
              <Info
                size={18}
                className="text-bol-blue cursor-help"
                title="All financial data will be displayed in Indian Rupees with lakh/crore formatting"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Format
            </label>
            <input
              type="text"
              value="Indian (1,00,000)"
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Example: 1,00,000</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <input
              type="text"
              value="DD/MM/YYYY"
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Today: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 border-l-4 border-bol-blue p-3 rounded">
          <p className="text-xs text-gray-700 flex items-start gap-2">
            <Info size={14} className="text-bol-blue flex-shrink-0 mt-0.5" />
            All financial data will be displayed in Indian Rupees with lakh/crore formatting
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="gradient"
          onClick={handleSave}
          disabled={saving}
          className="min-w-[150px]"
        >
          {saving ? 'Saving...' : (
            <span className="flex items-center gap-2">
              <Save size={20} />
              Save Changes
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
