import { recommendedFood } from '@/lib/operations';
export function getFoodOptions() { return recommendedFood(); }
export function createDemoOrder(itemId: string, slot: string) { const item = recommendedFood().find(x => x.id === itemId); if (!item) throw new Error('Food item not found'); return { id: `ORD-${Date.now().toString().slice(-6)}`, item, slot, status: 'PLACED', paymentStatus: 'MOCK_PAID', pickupZone: 'The Fuel Dock' }; }
