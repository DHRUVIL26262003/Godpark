import { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Shield } from 'lucide-react';

const initialNodes: Node[] = [
    // Internet
    { id: 'internet', type: 'input', position: { x: 400, y: 0 }, data: { label: 'Internet (Untrusted)' }, style: { background: '#ef4444', color: 'white', border: '1px solid #7f1d1d' } },

    // Cloudflare WAF
    { id: 'waf', position: { x: 400, y: 100 }, data: { label: 'Cloudflare WAF / DDoS' }, style: { background: '#f97316', color: 'white', border: '1px solid #c2410c' } },

    // DMZ Group
    { id: 'dmz-group', type: 'group', position: { x: 100, y: 200 }, style: { width: 600, height: 300, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px dashed #ffff00' }, data: { label: 'DMZ (Demilitarized Zone)' } },
    { id: 'lb', position: { x: 150, y: 250 }, parentNode: 'dmz-group', data: { label: 'Load Balancer' }, extent: 'parent' },
    { id: 'web', position: { x: 350, y: 250 }, parentNode: 'dmz-group', data: { label: 'Web Server (React)' }, extent: 'parent' },
    { id: 'api', position: { x: 550, y: 250 }, parentNode: 'dmz-group', data: { label: 'API Gateway' }, extent: 'parent' },
    { id: 'bastion', position: { x: 150, y: 400 }, parentNode: 'dmz-group', data: { label: 'Bastion Host' }, extent: 'parent' },
    { id: 'honeypot', position: { x: 350, y: 400 }, parentNode: 'dmz-group', data: { label: 'Honeypot' }, extent: 'parent' },
    { id: 'auth', position: { x: 550, y: 400 }, parentNode: 'dmz-group', data: { label: 'Auth Proxy' }, extent: 'parent' },

    // App Tier Group
    { id: 'app-group', type: 'group', position: { x: 100, y: 550 }, style: { width: 600, height: 200, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px dashed #3b82f6' }, data: { label: 'App Tier (Internal)' } },
    { id: 'app1', position: { x: 150, y: 600 }, parentNode: 'app-group', data: { label: 'App Server 1' }, extent: 'parent' },
    { id: 'app2', position: { x: 350, y: 600 }, parentNode: 'app-group', data: { label: 'App Server 2' }, extent: 'parent' },
    { id: 'ai', position: { x: 550, y: 600 }, parentNode: 'app-group', data: { label: 'AI Threat Engine' }, extent: 'parent' },

    // Data Tier Group
    { id: 'data-group', type: 'group', position: { x: 100, y: 800 }, style: { width: 600, height: 200, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px dashed #ef4444' }, data: { label: 'Data Tier (Restricted)' } },
    { id: 'db', position: { x: 150, y: 850 }, parentNode: 'data-group', data: { label: 'Primary DB' }, extent: 'parent' },
    { id: 'siem', position: { x: 350, y: 850 }, parentNode: 'data-group', data: { label: 'SIEM Aggregator' }, extent: 'parent' },
    { id: 'ad', position: { x: 550, y: 850 }, parentNode: 'data-group', data: { label: 'Active Directory' }, extent: 'parent' },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'internet', target: 'waf', animated: true, style: { stroke: '#ef4444' } },
    { id: 'e2-3', source: 'waf', target: 'lb', animated: true },
    { id: 'e3-4', source: 'lb', target: 'web' },
    { id: 'e4-5', source: 'web', target: 'api' },
    { id: 'e5-app1', source: 'api', target: 'app1', animated: true },
    { id: 'e5-app2', source: 'api', target: 'app2', animated: true },
    { id: 'e-app1-db', source: 'app1', target: 'db' },
    { id: 'e-app2-db', source: 'app2', target: 'db' },
    { id: 'e-app-ai', source: 'app1', target: 'ai', style: { strokeDasharray: 5 } },
    { id: 'e-ai-siem', source: 'ai', target: 'siem', animated: true, style: { stroke: '#eab308' } },
    { id: 'e-auth-ad', source: 'auth', target: 'ad', style: { stroke: '#3b82f6' } },
];

export function NetworkTopology() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="h-[800px] w-full border border-white/10 rounded-lg bg-[#050B14] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h3 className="text-white font-mono flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    ENTERPRISE ZERO-TRUST ARCHITECTURE (LIVE VIEW)
                </h3>
                <div className="flex space-x-4 text-xs">
                    <div className="flex items-center text-red-500"><span className="w-2 h-2 rounded-full bg-red-500 mr-2" /> External</div>
                    <div className="flex items-center text-yellow-500"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" /> DMZ</div>
                    <div className="flex items-center text-blue-500"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Internal</div>
                </div>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
                className="bg-[#050B14]"
            >
                <MiniMap nodeStrokeColor="#fff" nodeColor="#1a1a1a" maskColor="rgba(0, 0, 0, 0.7)" />
                <Controls className="bg-white/10 border-white/10" />
                <Background color="#333" gap={16} />
            </ReactFlow>
        </div>
    );
}
