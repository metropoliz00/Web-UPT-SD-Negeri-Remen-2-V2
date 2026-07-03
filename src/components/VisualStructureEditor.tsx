import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  Node,
  Edge,
  NodeChange,
  Connection,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StrukturItem } from '../types';
import { 
  User, 
  GitFork, 
  Settings, 
  Unlink, 
  Sparkles, 
  MousePointerClick, 
  Move, 
  Info,
  Layers,
  Activity,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Custom Node Component to match the app's style with multiple handles for layout flexibility
interface OrgNodeProps {
  data: { 
    id: string;
    label: string; 
    role: string; 
    photo: string;
    selected: boolean;
    connectionType?: 'komando' | 'koordinasi';
  };
}

const OrgNode: React.FC<OrgNodeProps> = ({ data }) => {
  const isSiswa = data.role.toLowerCase() === 'siswa';

  return (
    <div className={`bg-white dark:bg-slate-900 border-2 transition-all duration-300 rounded-[1.5rem] p-3 shadow-md min-w-[210px] flex items-center justify-center relative hover:shadow-xl ${
      isSiswa ? '' : 'space-x-3'
    } ${
      data.selected 
        ? 'border-brand-primary ring-4 ring-brand-primary/15 scale-105' 
        : 'border-slate-200 dark:border-slate-800'
    }`}>
      {/* Target handles for incoming connections (Top & Left) */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-brand-primary !w-2.5 !h-2.5 hover:!scale-150 !border-2 !border-white dark:!border-slate-900 transition-transform" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-brand-orange !w-2.5 !h-2.5 hover:!scale-150 !border-2 !border-white dark:!border-slate-900 transition-transform" />
      
      {isSiswa ? (
        <div className="py-2 text-center">
          <div className="text-xs font-display font-black text-brand-navy dark:text-white uppercase tracking-widest">SISWA</div>
          <div className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">ID: {data.id}</div>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
            <img src={data.photo} alt={data.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-[8px] font-black uppercase text-brand-orange leading-none mb-1 tracking-widest">{data.role}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{data.label}</div>
            <div className="text-[7px] text-slate-400 font-bold uppercase mt-0.5 flex items-center space-x-1">
              <span>ID: {data.id}</span>
            </div>
          </div>
        </>
      )}

      {/* Source handles for outgoing connections (Bottom & Right) */}
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-brand-primary !w-2.5 !h-2.5 hover:!scale-150 !border-2 !border-white dark:!border-slate-900 transition-transform" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-brand-orange !w-2.5 !h-2.5 hover:!scale-150 !border-2 !border-white dark:!border-slate-900 transition-transform" />
    </div>
  );
};

const nodeTypes = {
  orgNode: OrgNode,
};

interface VisualStructureEditorProps {
  items: StrukturItem[];
  onChange: (items: StrukturItem[]) => void;
}

export const VisualStructureEditor: React.FC<VisualStructureEditorProps> = ({ items, onChange }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Maintain local state of nodes for smooth non-jittery dragging
  const [localNodes, setLocalNodes] = useState<Node[]>([]);

  // Sync nodes from props when items list length or content changes, but keep positions if they are already active
  useEffect(() => {
    setLocalNodes(items.map((item) => ({
      id: item.id,
      type: 'orgNode',
      data: { 
        id: item.id,
        label: item.name, 
        role: item.role, 
        photo: item.photo,
        selected: item.id === selectedNodeId,
        connectionType: item.connectionType || 'komando'
      },
      position: item.position || { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
    })));
  }, [items, selectedNodeId]);

  // Edges derived dynamically from items relationships
  const edges: Edge[] = useMemo(() => items
    .filter(item => item.parentId)
    .map((item) => {
      const isKoordinasi = item.connectionType === 'koordinasi';
      return {
        id: `e-${item.parentId}-${item.id}`,
        source: item.parentId!,
        target: item.id,
        sourceHandle: isKoordinasi ? 'right' : 'bottom',
        targetHandle: isKoordinasi ? 'left' : 'top',
        animated: true,
        style: { 
          stroke: isKoordinasi ? '#f97316' : '#2563eb', 
          strokeWidth: 3,
          strokeDasharray: isKoordinasi ? '6,6' : undefined,
        },
      };
    }), [items]);

  // Handle live dragging locally for performance
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setLocalNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // Write drag results to global state only after dragging stops
  const onNodeDragStop = useCallback(
    (_event: any, draggedNode: Node) => {
      const updatedItems = items.map(item => {
        if (item.id === draggedNode.id) {
          return { ...item, position: draggedNode.position };
        }
        return item;
      });
      onChange(updatedItems);
    },
    [items, onChange]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Set visual connections by drawing lines
  const onConnect = useCallback(
    (params: Connection) => {
      const updatedItems = items.map(item => {
        if (item.id === params.target) {
          return { 
            ...item, 
            parentId: params.source,
            connectionType: item.connectionType || 'komando' // default to command
          };
        }
        return item;
      });
      onChange(updatedItems);
    },
    [items, onChange]
  );

  // Extract selected item for the editor sidebar
  const selectedItem = useMemo(() => {
    return items.find(item => item.id === selectedNodeId) || null;
  }, [items, selectedNodeId]);

  // Helper to update a single property of the selected item
  const handleUpdateSelected = useCallback((field: keyof StrukturItem, value: any) => {
    if (!selectedNodeId) return;
    const updatedItems = items.map(item => {
      if (item.id === selectedNodeId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updatedItems);
  }, [items, selectedNodeId, onChange]);

  // Handle alignment helpers
  const handleAutoLayout = () => {
    if (items.length === 0) return;

    const itemMap = new Map(items.map(item => [item.id, item]));
    const childrenMap: Record<string, string[]> = {};
    const coordinationMap: Record<string, string[]> = {};

    items.forEach(item => {
      childrenMap[item.id] = [];
      coordinationMap[item.id] = [];
    });

    items.forEach(item => {
      if (item.parentId && itemMap.has(item.parentId)) {
        if (item.connectionType === 'koordinasi') {
          coordinationMap[item.parentId].push(item.id);
        } else {
          childrenMap[item.parentId].push(item.id);
        }
      }
    });

    // Find roots (items with no parents or whose parents are not in the list)
    const roots = items.filter(item => {
      if (!item.parentId) return true;
      return !itemMap.has(item.parentId);
    });

    // To prevent overlapping, calculate subtree width
    const subtreeWidths: Record<string, number> = {};
    const getSubtreeWidth = (id: string): number => {
      const children = childrenMap[id] || [];
      if (children.length === 0) {
        return 260; // minimum width for a leaf node (with space)
      }
      const sum = children.reduce((acc, childId) => acc + getSubtreeWidth(childId), 0);
      const computed = Math.max(sum, 260);
      subtreeWidths[id] = computed;
      return computed;
    };

    roots.forEach(root => getSubtreeWidth(root.id));

    const positions: Record<string, { x: number; y: number }> = {};
    
    // Recursive layout function
    const layoutNode = (id: string, leftBoundary: number, depth: number) => {
      const width = subtreeWidths[id] || 260;
      const xPos = leftBoundary + width / 2;
      const yPos = depth * 180 + 80;

      positions[id] = { x: Math.round(xPos), y: Math.round(yPos) };

      // Handle coordination partners.
      // Usually, coordination partners are placed to the left or right of the node on the same level.
      const partners = coordinationMap[id] || [];
      partners.forEach((partnerId, index) => {
        // First partner to the right, second to the left, etc.
        const direction = index % 2 === 0 ? 1 : -1;
        const multiplier = Math.floor(index / 2) + 1;
        const offset = direction * multiplier * 250;
        positions[partnerId] = {
          x: Math.round(xPos + offset),
          y: Math.round(yPos)
        };
      });

      // Layout children
      const children = childrenMap[id] || [];
      let currentLeft = leftBoundary;
      children.forEach(childId => {
        const childWidth = subtreeWidths[childId] || 260;
        layoutNode(childId, currentLeft, depth + 1);
        currentLeft += childWidth;
      });
    };

    // Run layout for all root trees
    let currentLeft = 100;
    roots.forEach(root => {
      const rootWidth = subtreeWidths[root.id] || 260;
      layoutNode(root.id, currentLeft, 0);
      currentLeft += rootWidth + 150; // extra gap between trees
    });

    // Ensure any leftover nodes that didn't get positioned are assigned a neat default position
    const finalItems = items.map(item => {
      const pos = positions[item.id];
      if (pos) {
        return {
          ...item,
          position: pos
        };
      }
      return item;
    });

    onChange(finalItems);
  };

  const handleAlignVertical = () => {
    if (items.length === 0) return;
    const updatedItems = items.map((item, idx) => ({
      ...item,
      position: { x: 150, y: idx * 140 + 50 }
    }));
    onChange(updatedItems);
  };

  const handleAlignHorizontal = () => {
    if (items.length === 0) return;
    const updatedItems = items.map((item, idx) => ({
      ...item,
      position: { x: idx * 250 + 50, y: 150 }
    }));
    onChange(updatedItems);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row h-[700px] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
      {/* LEFT: ReactFlow canvas viewport */}
      <div className="flex-1 h-full bg-slate-50 dark:bg-slate-950 relative flex flex-col min-h-[400px]">
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 max-w-[85%] md:max-w-md">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center space-x-1.5">
              <Move className="h-4 w-4 text-brand-primary" />
              <span>Canvas Visual Organisasi</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">
              • Seret kartu untuk memindahkan posisinya secara bebas (Otomatis Snap ke Grid).<br />
              • Tarik garis antar bulatan luar untuk menghubungkan Atasan & Bawahan.<br />
              • Klik kartu untuk mengubah tipe garis hubungan di panel kanan.
            </p>
          </div>
 
          {/* Quick Layout Tools */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={handleAutoLayout}
              className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white border border-brand-primary text-[9px] font-black uppercase rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-1 hover:scale-105 active:scale-95"
              title="Rapikan seluruh struktur secara otomatis dan presisi"
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Tata Letak Otomatis (Rapi & Presisi)</span>
            </button>
            <button
              onClick={handleAlignVertical}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase rounded-lg shadow-sm transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            >
              Ratakan Vertikal
            </button>
            <button
              onClick={handleAlignHorizontal}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase rounded-lg shadow-sm transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            >
              Ratakan Horizontal
            </button>
          </div>
        </div>

        {/* Legend integrated transparently inside viewport */}
        <div className="absolute bottom-4 left-4 z-10 flex bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-xl shadow-md space-x-4 pointer-events-none text-[9px] font-bold text-slate-500">
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-1.5 bg-[#2563eb] rounded-full"></div>
            <span>Garis Komando (Struktural)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-1.5 border-t-2 border-dashed border-[#f97316]"></div>
            <span>Garis Koordinasi (Fungsional)</span>
          </div>
        </div>

        {/* Toggle Panel Button when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 right-4 z-20 px-3.5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex items-center space-x-1.5 text-[10px] font-black uppercase text-brand-orange transition-all cursor-pointer hover:scale-105 active:scale-95 animate-fade-in"
            title="Tampilkan Panel"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Buka Panel Konfigurasi</span>
          </button>
        )}

        <ReactFlow
          nodes={localNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid={true}
          snapGrid={[10, 10]}
          className="flex-1"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* RIGHT SIDEBAR: Config & properties panel (Collapsible) */}
      <div className={`h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        isSidebarOpen 
          ? 'w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l opacity-100' 
          : 'w-0 lg:w-0 border-t-0 border-l-0 opacity-0 pointer-events-none'
      }`}>
        <div className="min-w-[340px] h-full flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center space-x-2">
              <Settings className="h-4.5 w-4.5 text-brand-orange" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Panel Konfigurasi</h4>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Sembunyikan Panel"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {selectedItem ? (
            <div className="p-5 flex-1 overflow-y-auto space-y-5 animate-fade-in">
              {/* Header Profil */}
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <img src={selectedItem.photo} alt={selectedItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-white truncate">{selectedItem.name}</h5>
                  <span className="text-[9px] font-black uppercase text-brand-orange leading-none">{selectedItem.role}</span>
                </div>
              </div>

              {/* Hubungan (Atasan / Mitra Koordinasi) Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black block flex items-center space-x-1">
                  <GitFork className="h-3 w-3 text-brand-primary" />
                  <span>Hubungan Dengan (Atasan atau Koordinasi)</span>
                </label>
                <select
                  value={selectedItem.parentId || ''}
                  onChange={e => handleUpdateSelected('parentId', e.target.value || undefined)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-slate-700 dark:text-slate-200"
                >
                  <option value="">-- Tanpa Hubungan (Mandiri / Posisi Puncak) --</option>
                  {items
                    .filter(m => m.id !== selectedItem.id)
                    .map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                </select>
                <p className="text-[9px] text-slate-400 leading-normal">
                  Pilih personil yang terhubung dengan orang ini (Atasan Struktural atau Mitra Sejajar).
                </p>
              </div>

              {/* Line / Relationship Type */}
              {selectedItem.parentId && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black block flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-brand-orange" />
                    <span>Tipe Garis Hubungan</span>
                  </label>
                  
                  <div className="space-y-2">
                    {/* Komando Button Option */}
                    <button
                      onClick={() => handleUpdateSelected('connectionType', 'komando')}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        (selectedItem.connectionType || 'komando') === 'komando'
                          ? 'bg-[#2563eb]/5 dark:bg-[#2563eb]/10 border-[#2563eb] text-[#2563eb] font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-[#2563eb] rounded-full"></div>
                        <div>
                          <div className="text-[11px] font-black">Garis Komando (Atasan)</div>
                          <p className="text-[8px] text-slate-400 font-normal mt-0.5">Hubungan vertikal / struktural langsung (misal: Kepala Sekolah ke Guru).</p>
                        </div>
                      </div>
                      {(selectedItem.connectionType || 'komando') === 'komando' && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>

                    {/* Koordinasi Button Option */}
                    <button
                      onClick={() => handleUpdateSelected('connectionType', 'koordinasi')}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        selectedItem.connectionType === 'koordinasi'
                          ? 'bg-[#f97316]/5 dark:bg-[#f97316]/10 border-[#f97316] text-[#f97316] font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 border-t-2 border-dashed border-[#f97316]"></div>
                        <div>
                          <div className="text-[11px] font-black">Garis Koordinasi (Samping)</div>
                          <p className="text-[8px] text-slate-400 font-normal mt-0.5">Hubungan mitra sejajar / fungsional (misal: Pengawas ke Kepsek, Kepsek ke Ketua Komite).</p>
                        </div>
                      </div>
                      {selectedItem.connectionType === 'koordinasi' && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  </div>

                  <p className="text-[9px] text-slate-400 leading-normal mt-1 bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    💡 <strong>Tips Hubungan Samping:</strong> Jika tipe <strong>Garis Koordinasi</strong> dipilih, garis penghubung otomatis diposisikan <strong>pinggir ke pinggir</strong> (kiri-kanan) agar tampak rapi sejajar.
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {selectedItem.parentId && (
                  <button
                    onClick={() => handleUpdateSelected('parentId', undefined)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                    <span>Putuskan Hubungan Garis</span>
                  </button>
                )}
                
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start space-x-2">
                  <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-blue-600 dark:text-blue-400 leading-normal">
                    Posisi koordinat <strong>X: {Math.round(selectedItem.position?.x || 0)}, Y: {Math.round(selectedItem.position?.y || 0)}</strong>. 
                    Posisi ini disimpan secara real-time dan akan dimuat secara persis pada halaman Struktur Organisasi publik.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-750">
                <MousePointerClick className="h-5 w-5 text-slate-400 animate-pulse" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300">Belum Ada Kartu Terpilih</h5>
                <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1 leading-normal">
                  Silakan klik pada salah satu kartu di canvas sebelah kiri untuk mengatur hubungan garis (komando/koordinasi) dan melihat info posisi koordinatnya.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
