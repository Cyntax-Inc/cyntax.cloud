"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { usePortalAccess } from "../../../components/dashboard/PortalAccessProvider";
import ThemeSwitcher from "../../../components/dashboard/ThemeSwitcher";
import PasswordSettings from "../../../components/dashboard/PasswordSettings";

type ProfileForm = {
  displayName: string;
  email: string;
  phone: string;
  title: string;
  companyName: string;
  billingEmail: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  timezone: string;
  role: string;
};

type ProfileField = {
  key: keyof ProfileForm;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  wide?: boolean;
};

const emptyForm: ProfileForm = {
  displayName: "",
  email: "",
  phone: "",
  title: "",
  companyName: "",
  billingEmail: "",
  website: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  timezone: "",
  role: "",
};

const personalFields: ProfileField[] = [
  { key: "displayName", label: "Full name", placeholder: "Full name" },
  { key: "email", label: "Email address", disabled: true },
  { key: "phone", label: "Phone", placeholder: "Phone" },
  { key: "title", label: "Job title", placeholder: "Job title" },
  { key: "role", label: "Account role", disabled: true },
];

const companyFields: ProfileField[] = [
  { key: "companyName", label: "Company name", placeholder: "Company name", wide: true },
  { key: "billingEmail", label: "Billing email", placeholder: "Billing email" },
  { key: "website", label: "Website", placeholder: "Website" },
  { key: "addressLine1", label: "Address line 1", placeholder: "Address line 1", wide: true },
  { key: "addressLine2", label: "Address line 2", placeholder: "Address line 2", wide: true },
  { key: "city", label: "City", placeholder: "City" },
  { key: "state", label: "State", placeholder: "State" },
  { key: "postalCode", label: "Postal code", placeholder: "Postal code" },
  { key: "country", label: "Country", placeholder: "Country" },
  { key: "timezone", label: "Timezone", placeholder: "Timezone", wide: true },
];

function ProfileDetails({ fields, form }: { fields: ProfileField[]; form: ProfileForm }) {
  return (
    <dl className="space-y-3.5">
      {fields.map(({ key, label }) => (
        <div key={key} className="grid min-w-0 grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
          <dt className="text-xs leading-5 text-portal-muted">{label}</dt>
          <dd className="min-w-0 break-words text-sm leading-5 text-portal-foreground">
            {form[key]?.trim() || "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProfileEditor({
  prefix,
  fields,
  form,
  onUpdate,
}: {
  prefix: string;
  fields: ProfileField[];
  form: ProfileForm;
  onUpdate: (key: keyof ProfileForm, value: string) => void;
}) {
  return (
    <div className="grid min-w-0 gap-x-4 gap-y-4 sm:grid-cols-2">
      {fields.map(({ key, label, placeholder, disabled, wide }) => (
        <div key={key} className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
          <label htmlFor={`${prefix}-${key}`} className="mb-1.5 block text-xs font-medium text-portal-muted">
            {label}
          </label>
          <input
            id={`${prefix}-${key}`}
            type="text"
            value={form[key]}
            onChange={(event) => onUpdate(key, event.target.value)}
            disabled={disabled}
            placeholder={placeholder || label}
            className="h-11 w-full min-w-0 rounded-lg border border-portal-outline bg-portal-surface-raised px-3 text-sm text-portal-foreground outline-none transition placeholder:text-portal-subtle focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      ))}
    </div>
  );
}

export default function ProfileSettingsPage() {
  const { readOnly } = usePortalAccess();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [originalForm, setOriginalForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/settings/profile", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        const nextForm: ProfileForm = { ...emptyForm, ...data.profile };
        setForm(nextForm);
        setOriginalForm(nextForm);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(originalForm),
    [form, originalForm]
  );

  function updateField(key: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function cancelUserEdit() {
    setForm((prev) => ({
      ...prev,
      displayName: originalForm.displayName,
      phone: originalForm.phone,
      title: originalForm.title,
    }));
    setEditingUser(false);
    setMessage("");
    setError("");
  }

  function cancelCompanyEdit() {
    setForm((prev) => ({
      ...prev,
      companyName: originalForm.companyName,
      billingEmail: originalForm.billingEmail,
      website: originalForm.website,
      addressLine1: originalForm.addressLine1,
      addressLine2: originalForm.addressLine2,
      city: originalForm.city,
      state: originalForm.state,
      postalCode: originalForm.postalCode,
      country: originalForm.country,
      timezone: originalForm.timezone,
    }));
    setEditingCompany(false);
    setMessage("");
    setError("");
  }

  async function saveAll() {
    if (readOnly) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          phone: form.phone,
          title: form.title,
          companyName: form.companyName,
          billingEmail: form.billingEmail,
          website: form.website,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          timezone: form.timezone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      setOriginalForm(form);
      setEditingUser(false);
      setEditingCompany(false);
      setMessage("Settings updated successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-0 max-w-5xl space-y-8 pb-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-portal-accent">Account</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-portal-foreground">Settings</h1>
        <p className="mt-1.5 text-sm text-portal-muted">Manage your account and preferences.</p>
      </header>

      {readOnly && (
        <p role="status" className="rounded-md bg-portal-accent-soft px-4 py-3 text-sm text-portal-foreground">
          This account has view-only access. Profile changes are managed outside the client portal.
        </p>
      )}
      {error && <p role="alert" className="rounded-md bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {message && <p role="status" className="rounded-md bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      {loading ? (
        <div role="status" className="py-8 text-sm text-portal-muted">Loading settings...</div>
      ) : (
        <>
          {/* DOM order is intentional: Personal, Company, Security, Appearance on all screens. */}
          <div className="grid min-w-0 gap-x-12 gap-y-10 lg:grid-cols-2">
            <section aria-labelledby="personal-title" className="min-w-0">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 id="personal-title" className="text-base font-semibold text-portal-foreground">Personal information</h2>
                  <p className="mt-1 text-xs leading-5 text-portal-muted">Your profile and contact details.</p>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      if (editingUser) cancelUserEdit();
                      else { setEditingUser(true); setMessage(""); setError(""); }
                    }}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-portal-outline px-3 text-xs font-medium text-portal-foreground transition hover:bg-portal-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50"
                  >
                    {editingUser ? <X className="h-3.5 w-3.5" aria-hidden="true" /> : <Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                    {editingUser ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              {editingUser ? (
                <ProfileEditor prefix="personal" fields={personalFields} form={form} onUpdate={updateField} />
              ) : (
                <ProfileDetails fields={personalFields} form={form} />
              )}
            </section>

            <section aria-labelledby="company-title" className="min-w-0">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 id="company-title" className="text-base font-semibold text-portal-foreground">Company information</h2>
                  <p className="mt-1 text-xs leading-5 text-portal-muted">Business and billing contact details.</p>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      if (editingCompany) cancelCompanyEdit();
                      else { setEditingCompany(true); setMessage(""); setError(""); }
                    }}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-portal-outline px-3 text-xs font-medium text-portal-foreground transition hover:bg-portal-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50"
                  >
                    {editingCompany ? <X className="h-3.5 w-3.5" aria-hidden="true" /> : <Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                    {editingCompany ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              {editingCompany ? (
                <ProfileEditor prefix="company" fields={companyFields} form={form} onUpdate={updateField} />
              ) : (
                <ProfileDetails fields={companyFields} form={form} />
              )}
            </section>

            <PasswordSettings />

            <section aria-labelledby="appearance-title" className="min-w-0">
              <h2 id="appearance-title" className="text-base font-semibold text-portal-foreground">Appearance</h2>
              <p className="mb-4 mt-1 text-xs leading-5 text-portal-muted">Choose Light, Dark, or follow your device.</p>
              <ThemeSwitcher />
            </section>
          </div>

          {!readOnly && (editingUser || editingCompany) && (
            <div className="flex flex-col gap-3 border-t border-portal-outline pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-portal-foreground">{hasChanges ? "Unsaved changes" : "Editing account details"}</p>
                <p className="mt-0.5 text-xs text-portal-muted">Save your updates when you're finished editing.</p>
              </div>
              <button
                type="button"
                onClick={saveAll}
                disabled={saving || !hasChanges}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
