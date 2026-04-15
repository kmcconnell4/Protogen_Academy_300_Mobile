import { products } from '../src/lib/mock/products';
import { jobs } from '../src/lib/mock/jobs';
import { orders } from '../src/lib/mock/orders';
import { quotes } from '../src/lib/mock/quotes';
import { users } from '../src/lib/mock/users';

const categories = Array.from(new Set(products.map(p => p.category)));
const inStockCount = products.filter(p => p.inStock).length;
const jobsByStatus = jobs.reduce<Record<string, number>>((acc, j) => {
  acc[j.status] = (acc[j.status] ?? 0) + 1;
  return acc;
}, {});

console.log('✅ Mock data ready:');
console.log(`   ${products.length} products across ${categories.length} categories`);
console.log(`   ${inStockCount} in-stock, ${products.length - inStockCount} out-of-stock`);
console.log(`   Categories: ${categories.join(', ')}`);
console.log(`   ${jobs.length} jobs — ${Object.entries(jobsByStatus).map(([s, n]) => `${n} ${s}`).join(', ')}`);
console.log(`   ${orders.length} orders`);
console.log(`   ${quotes.length} quotes`);
console.log(`   ${users.length} users (${users.filter(u => u.role === 'contractor').length} contractors, ${users.filter(u => u.role === 'rep').length} reps)`);
