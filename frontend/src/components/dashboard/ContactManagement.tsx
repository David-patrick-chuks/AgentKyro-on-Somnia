"use client";
import { AgentKyroApiClient, Contact } from "@/utils/api";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaPlus, FaSearch, FaShieldAlt, FaTrash, FaUsers } from "react-icons/fa";

export default function ContactManagement() {
  const { user } = usePrivy();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    group: "",
    verified: false,
  });

  const walletAddress = user?.wallet?.address || "";

  useEffect(() => {
    if (walletAddress) {
      fetchContacts();
      fetchGroups();
    }
  }, [walletAddress]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AgentKyroApiClient.contacts.getContacts(walletAddress);
      
      if (response.success && response.data) {
        setContacts(response.data);
      } else {
        setError(response.error || "Failed to fetch contacts");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await AgentKyroApiClient.contacts.getContactGroups(walletAddress);
      if (response.success && response.data) {
        setGroups(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await AgentKyroApiClient.contacts.addContact(walletAddress, formData);
      
      if (response.success) {
        setShowAddModal(false);
        setFormData({ name: "", address: "", group: "", verified: false });
        fetchContacts();
        fetchGroups();
      } else {
        setError(response.error || "Failed to add contact");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      const response = await AgentKyroApiClient.contacts.updateContact(walletAddress, editingContact.id, formData);
      
      if (response.success) {
        setEditingContact(null);
        setFormData({ name: "", address: "", group: "", verified: false });
        fetchContacts();
        fetchGroups();
      } else {
        setError(response.error || "Failed to update contact");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await AgentKyroApiClient.contacts.deleteContact(walletAddress, contactId);
      
      if (response.success) {
        fetchContacts();
      } else {
        setError(response.error || "Failed to delete contact");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleVerifyContact = async (contact: Contact) => {
    try {
      const response = await AgentKyroApiClient.contacts.verifyContact(walletAddress, contact.address);
      
      if (response.success && response.data) {
        // Update the contact with verification status
        const updatedContact = { ...contact, verified: response.data.verified };
        await AgentKyroApiClient.contacts.updateContact(walletAddress, contact.id, updatedContact);
        fetchContacts();
      } else {
        setError(response.error || "Failed to verify contact");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      address: contact.address,
      group: contact.group || "",
      verified: contact.verified || false,
    });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "all" || contact.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Contact Management
          </h2>
          <p className="text-slate-400 mt-1">Manage your address book and contact groups</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          Add Contact
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-all duration-300"
          />
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all duration-300"
        >
          <option value="all">All Groups</option>
          {groups.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{contact.name}</h3>
                  <p className="text-slate-400 text-sm">
                    {contact.address.slice(0, 6)}...{contact.address.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(contact)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
                >
                  <FaEdit className="text-slate-400 hover:text-white text-sm" />
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all duration-300"
                >
                  <FaTrash className="text-red-400 hover:text-red-300 text-sm" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Address</span>
                <span className="text-white text-sm font-mono">{contact.address}</span>
              </div>
              
              {contact.group && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Group</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {contact.group}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <div className="flex items-center gap-2">
                  {contact.verified ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      <FaCheck className="text-xs" />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVerifyContact(contact)}
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs rounded-full transition-colors duration-300"
                    >
                      <FaShieldAlt className="text-xs" />
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="text-6xl text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Contacts Found</h3>
          <p className="text-slate-400 mb-6">
            {searchQuery || selectedGroup !== "all" 
              ? "No contacts match your search criteria." 
              : "Start by adding your first contact to your address book."
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-300"
          >
            Add Your First Contact
          </button>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {(showAddModal || editingContact) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </h3>
            
            <form onSubmit={editingContact ? handleUpdateContact : handleAddContact} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-all duration-300"
                  placeholder="Enter contact name"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-all duration-300"
                  placeholder="0x..."
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Group (Optional)</label>
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-all duration-300"
                  placeholder="e.g., Family, Friends, Business"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="verified" className="text-slate-400 text-sm">
                  Mark as verified
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-300"
                >
                  {editingContact ? "Update Contact" : "Add Contact"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContact(null);
                    setFormData({ name: "", address: "", group: "", verified: false });
                  }}
                  className="px-4 py-3 bg-slate-800/20 hover:bg-slate-700/40 border border-slate-600/30 hover:border-slate-500/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
