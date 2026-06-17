import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Award, Plus, Search, Filter, ShoppingBag, ListCollapse } from 'lucide-react';

export default function RecognitionManagerDashboard() {
  const { setApiError, setSuccessMsg, refreshTrigger, setRefreshTrigger } = useAuth();

  const [allAwards, setAllAwards] = useState<any[]>([]);
  const [allPoints, setAllPoints] = useState<any[]>([]);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState<'awards' | 'points' | 'catalog'>('awards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [newCatalogItem, setNewCatalogItem] = useState({
    itemName: '',
    category: 'Voucher',
    pointsRequired: 500,
    availableQuantity: 50
  });

  // Emoji reactions state for awards
  const [awardReactions, setAwardReactions] = useState<Record<number, any>>(() => {
    try {
      const stored = localStorage.getItem('wellbeing360_award_reactions');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleReactToAward = (awardId: number, reactionType: string) => {
    setAwardReactions(prev => {
      const current = prev[awardId] || { claps: 3, hearts: 2, fire: 1, stars: 1, party: 2 };
      const updated = {
        ...prev,
        [awardId]: {
          ...current,
          [reactionType]: (current[reactionType] || 0) + 1
        }
      };
      localStorage.setItem('wellbeing360_award_reactions', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    async function loadRecognitionData() {
      try {
        const [awards, points, catalog] = await Promise.all([
          api.getAllAwards().catch(() => []),
          api.getAllPointsBalances().catch(() => []),
          api.getCatalog().catch(() => [])
        ]);
        setAllAwards(awards);
        setAllPoints(points);
        setCatalogItems(catalog);
      } catch (err: any) {
        console.error('Failed to load recognition details:', err);
      }
    }
    loadRecognitionData();
  }, [refreshTrigger]);

  const handleCreateCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.createCatalogItem(newCatalogItem);
      setSuccessMsg(`Catalog item "${newCatalogItem.itemName}" added successfully!`);
      setNewCatalogItem({
        itemName: '',
        category: 'Voucher',
        pointsRequired: 500,
        availableQuantity: 50
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to add catalog item.');
    }
  };

  const filteredAwards = allAwards.filter(a => {
    const matchesSearch = a.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'All' || a.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full tracking-widest">Recognition Manager</span>
          <h2 className="text-2xl font-black mt-3">Awards & Peer Redemptions</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">Audit employee point balances, curate the merchandise catalog, and review nomination logs.</p>
        </div>
        <Award className="text-emerald-500 w-12 h-12 shrink-0 hidden sm:block" />
      </div>

      {/* Selector sub-tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0.5">
        {[
          { id: 'awards', label: 'Peer Nomination Log' },
          { id: 'points', label: 'Employee Balances' },
          { id: 'catalog', label: 'Manage Gift Catalog' }
        ].map(sub => (
          <button
            key={sub.id}
            onClick={() => {
              setActiveSubTab(sub.id as any);
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 font-bold text-xs cursor-pointer rounded-lg transition-all ${
              activeSubTab === sub.id 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Pane */}
        <div className="lg:col-span-8">
          
          {/* Awards Sub-tab */}
          {activeSubTab === 'awards' && (
            <div className="groww-card p-6 bg-white space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Historical Nomination Audit Logs</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search messages or recipients..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="custom-input pl-9" 
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="custom-select max-w-[150px]"
                  >
                    <option value="All">All Categories</option>
                    <option value="PeerRecognition">Peer Recognition</option>
                    <option value="MilestoneAward">Milestone Celebrations</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {filteredAwards.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No matching nominations records.</p>
                ) : (
                  filteredAwards.map(feed => {
                    const reactions = awardReactions[feed.awardID] || { claps: 3, hearts: 2, fire: 1, stars: 1, party: 2 };
                    return (
                      <div key={feed.awardID} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4 hover:-translate-y-0.5 duration-200">
                        {/* Header details */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-600 text-sm">
                              {feed.recipientName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                <span className="capitalize">{feed.nominatorName}</span> nominated <span className="capitalize text-emerald-500">{feed.recipientName}</span>
                              </p>
                              <span className="text-[10px] text-slate-400 font-semibold block">{new Date(feed.awardDate || feed.createdDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black px-3 py-1.5 rounded-xl shrink-0">
                            +{feed.pointsAwarded} pts
                          </div>
                        </div>

                        {/* Nomination message */}
                        <div className="p-3.5 bg-slate-50 border border-slate-100/60 rounded-xl">
                          <p className="text-xs text-slate-600 italic leading-relaxed">"{feed.message}"</p>
                        </div>

                        {/* Badge category tag & reactions block */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            🏆 {feed.badgeName}
                          </span>

                          {/* Social Reaction Buttons */}
                          <div className="flex items-center gap-1.5">
                            {[
                              { label: '👏', type: 'claps' },
                              { label: '❤️', type: 'hearts' },
                              { label: '🔥', type: 'fire' },
                              { label: '⭐', type: 'stars' },
                              { label: '🎉', type: 'party' }
                            ].map(emoji => (
                              <button
                                key={emoji.type}
                                onClick={() => handleReactToAward(feed.awardID, emoji.type)}
                                className="px-2 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1 text-slate-500"
                              >
                                <span>{emoji.label}</span>
                                <span className="text-[10px]">{reactions[emoji.type] || 0}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Points Sub-tab */}
          {activeSubTab === 'points' && (
            <div className="groww-card p-6 bg-white space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Corporate Employee Wallets</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                      <th className="p-3">Teammate ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Wallet Total Balance</th>
                      <th className="p-3">Last Activity synced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {allPoints.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">No employee balances recorded.</td>
                      </tr>
                    ) : (
                      allPoints.map(pt => (
                        <tr key={pt.employeeID}>
                          <td className="p-3 font-bold text-slate-800">EMP#{pt.employeeID}</td>
                          <td className="p-3 font-semibold text-slate-700 capitalize">{pt.employeeName}</td>
                          <td className="p-3 font-extrabold text-emerald-500 text-sm">{(pt.balance || 0).toLocaleString()} pts</td>
                          <td className="p-3 text-slate-400 font-semibold">{pt.lastUpdated ? new Date(pt.lastUpdated).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Catalog items list */}
          {activeSubTab === 'catalog' && (
            <div className="groww-card p-6 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-base">Active Merchandise catalog store</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catalogItems.map(item => (
                  <div key={item.itemID} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded tracking-wide">{item.category}</span>
                      <h4 className="font-bold text-slate-700 text-sm mt-1.5">{item.itemName}</h4>
                      <div className="flex gap-3 text-[10px] text-slate-400 font-semibold mt-1">
                        <span>Required: <strong className="text-emerald-500 font-bold">{item.pointsRequired} pts</strong></span>
                        <span>Stock: <strong className="text-slate-600 font-bold">{item.availableQuantity} units</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Forms panel (only shown if catalog tab active) */}
        <div className="lg:col-span-4">
          <div className="groww-card p-6 bg-white sticky top-20">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" /> New Catalog Item
            </h3>
            <form onSubmit={handleCreateCatalogItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Item Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Amazon $50 Voucher"
                  value={newCatalogItem.itemName}
                  onChange={(e) => setNewCatalogItem({ ...newCatalogItem, itemName: e.target.value })}
                  className="custom-input" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Merchandise Category</label>
                <select 
                  value={newCatalogItem.category} 
                  onChange={(e) => setNewCatalogItem({ ...newCatalogItem, category: e.target.value })}
                  className="custom-select"
                >
                  <option value="Voucher">Gift Voucher Cards</option>
                  <option value="Merchandise">Fitness Gear & Gear</option>
                  <option value="Experience">Calm/Spa Days</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Cost (Points)</label>
                  <input 
                    type="number" 
                    required 
                    value={newCatalogItem.pointsRequired}
                    onChange={(e) => setNewCatalogItem({ ...newCatalogItem, pointsRequired: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Stock Vol</label>
                  <input 
                    type="number" 
                    required 
                    value={newCatalogItem.availableQuantity}
                    onChange={(e) => setNewCatalogItem({ ...newCatalogItem, availableQuantity: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Add Catalog Item
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
