export type ObjectSize = 'small' | 'medium' | 'large' | 'huge' | 'selective' | 'key-order' | 'circular' | 'stable-state-hook-same-ref' | 'stable-state-hook-new-ref';

export function generateTestObject(size: ObjectSize): any {
  switch (size) {
    case 'small':
      return {
        id: Math.random(),
        name: 'Test User',
        active: true,
        count: 42,
      };
    
    case 'medium':
      return {
        id: Math.random(),
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          address: {
            street: '123 Main St',
            city: 'Springfield',
            zip: '12345',
          },
        },
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          price: Math.random() * 100,
        })),
        metadata: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          tags: ['tag1', 'tag2', 'tag3'],
        },
      };
    
    case 'large':
      return {
        id: Math.random(),
        users: Array.from({ length: 50 }, (_, i) => ({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          profile: {
            bio: 'Lorem ipsum dolor sit amet',
            avatar: `https://example.com/avatar${i}.jpg`,
            settings: {
              notifications: true,
              theme: 'dark',
              language: 'en',
            },
          },
        })),
        posts: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          title: `Post ${i}`,
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          author: Math.floor(Math.random() * 50),
          comments: Array.from({ length: 5 }, (_, j) => ({
            id: j,
            text: `Comment ${j}`,
            author: Math.floor(Math.random() * 50),
          })),
        })),
      };
    
    case 'huge':
      return {
        id: Math.random(),
        data: Array.from({ length: 200 }, (_, i) => ({
          id: i,
          nested: {
            level1: {
              level2: {
                level3: {
                  level4: {
                    value: Math.random(),
                    items: Array.from({ length: 10 }, (_, j) => ({
                      id: j,
                      data: Math.random().toString(36),
                    })),
                  },
                },
              },
            },
          },
        })),
      };
    
    case 'selective': {
      // Wide object with many top-level fields
      // But we only care about checking a few of them
      const obj: any = {
        // Critical fields (what we actually care about)
        id: 123,
        userId: 456,
        status: 'active',
      };
      
      // Add 100 irrelevant top-level fields
      for (let i = 0; i < 100; i++) {
        obj[`field${i}`] = {
          data: Math.random(),
          nested: Array.from({ length: 10 }, () => Math.random()),
          timestamp: Date.now(),
        };
      }
      
      return obj;
    }
    
    case 'key-order': {
      // Same values, but keys in consistently different order
      // This demonstrates that simple-comparator handles key ordering correctly
      // while JSON.stringify produces different strings
      const obj: any = {};
      // Always return same values, just in random key order per call
      const keys = ['field1', 'field2', 'field3', 'field4', 'field5'];
      const values = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
      
      // Shuffle keys but keep same values
      const shuffled = [...keys].sort(() => Math.random() - 0.5);
      shuffled.forEach((key, idx) => {
        const originalIndex = keys.indexOf(key);
        obj[key] = values[originalIndex]; // Same values, different key order
      });
      return obj;
    }
    
    case 'circular': {
      // Object with circular reference
      const circular: any = {
        id: 123,
        name: 'Test',
        nested: {
          data: 'some data',
        },
      };
      circular.self = circular;
      circular.nested.parent = circular;
      return circular;
    }
    
    case 'stable-state-hook-same-ref':
      // Simulates stable reference (no re-render needed)
      // Returns the SAME object reference
      return stableObjectCache;
    
    case 'stable-state-hook-new-ref': {
      // Simulates new reference but same content (common in React)
      // Create new objects each time to simulate React prop recreation
      return {
        id: 123,
        name: 'Test User',
        data: {
          value: 42,
          items: [1, 2, 3, 4, 5].slice(), // New array reference
        },
      };
    }
  }
}

// Cache for stable reference testing
const stableObjectCache = {
  id: 123,
  name: 'Test User',
  data: {
    value: 42,
    items: [1, 2, 3, 4, 5],
  },
};
