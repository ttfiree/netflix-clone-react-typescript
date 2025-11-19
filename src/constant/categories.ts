// 分类数据结构
export interface Category {
  type_id: number;
  type_name: string;
  type_en: string;
  type_pid: number;
  type_sort: number;
  type_status: number;
  children?: Category[];
}

// 一级分类（显示在导航栏）
export const PRIMARY_CATEGORIES: Category[] = [
  { type_id: 1, type_name: '电视剧', type_en: 'tv', type_pid: 0, type_sort: 1, type_status: 1 },
  { type_id: 2, type_name: '电影', type_en: 'movie', type_pid: 0, type_sort: 2, type_status: 1 },
  { type_id: 17, type_name: '动漫', type_en: 'anime', type_pid: 0, type_sort: 17, type_status: 1 },
  { type_id: 27, type_name: '综艺', type_en: 'variety', type_pid: 0, type_sort: 27, type_status: 1 },
  { type_id: 38, type_name: '短剧', type_en: 'short-drama', type_pid: 0, type_sort: 38, type_status: 1 },
];

// 所有分类（包括子分类）
export const ALL_CATEGORIES: Category[] = [
  // 一级分类
  { type_id: 1, type_name: '电视剧', type_en: 'tv', type_pid: 0, type_sort: 1, type_status: 1 },
  { type_id: 2, type_name: '电影', type_en: 'movie', type_pid: 0, type_sort: 2, type_status: 1 },
  { type_id: 8, type_name: '伦理片', type_en: 'ethics', type_pid: 0, type_sort: 8, type_status: 1 },
  { type_id: 17, type_name: '动漫', type_en: 'anime', type_pid: 0, type_sort: 17, type_status: 1 },
  { type_id: 27, type_name: '综艺', type_en: 'variety', type_pid: 0, type_sort: 27, type_status: 1 },
  { type_id: 29, type_name: '体育赛事', type_en: 'sports', type_pid: 0, type_sort: 29, type_status: 1 },
  { type_id: 38, type_name: '短剧', type_en: 'short-drama', type_pid: 0, type_sort: 38, type_status: 1 },
  { type_id: 39, type_name: '预告片', type_en: 'trailer', type_pid: 0, type_sort: 39, type_status: 1 },

  // 电视剧子分类 (type_pid=1)
  { type_id: 3, type_name: '欧美剧', type_en: 'western-tv', type_pid: 1, type_sort: 3, type_status: 1 },
  { type_id: 4, type_name: '香港剧', type_en: 'hk-tv', type_pid: 1, type_sort: 4, type_status: 1 },
  { type_id: 5, type_name: '韩剧', type_en: 'korean-tv', type_pid: 1, type_sort: 5, type_status: 1 },
  { type_id: 6, type_name: '日剧', type_en: 'japanese-tv', type_pid: 1, type_sort: 6, type_status: 1 },
  { type_id: 7, type_name: '马泰剧', type_en: 'thai-tv', type_pid: 1, type_sort: 7, type_status: 1 },
  { type_id: 20, type_name: '内地剧', type_en: 'mainland-tv', type_pid: 1, type_sort: 20, type_status: 1 },
  { type_id: 28, type_name: '台湾剧', type_en: 'taiwan-tv', type_pid: 1, type_sort: 28, type_status: 1 },

  // 电影子分类 (type_pid=2)
  { type_id: 9, type_name: '动作片', type_en: 'action', type_pid: 2, type_sort: 9, type_status: 1 },
  { type_id: 10, type_name: '爱情片', type_en: 'romance', type_pid: 2, type_sort: 10, type_status: 1 },
  { type_id: 11, type_name: '喜剧片', type_en: 'comedy', type_pid: 2, type_sort: 11, type_status: 1 },
  { type_id: 12, type_name: '科幻片', type_en: 'sci-fi', type_pid: 2, type_sort: 12, type_status: 1 },
  { type_id: 13, type_name: '恐怖片', type_en: 'horror', type_pid: 2, type_sort: 13, type_status: 1 },
  { type_id: 14, type_name: '剧情片', type_en: 'drama', type_pid: 2, type_sort: 14, type_status: 1 },
  { type_id: 15, type_name: '战争片', type_en: 'war', type_pid: 2, type_sort: 15, type_status: 1 },
  { type_id: 16, type_name: '记录片', type_en: 'documentary', type_pid: 2, type_sort: 16, type_status: 1 },
  { type_id: 23, type_name: '动画片', type_en: 'animation', type_pid: 2, type_sort: 23, type_status: 1 },
  { type_id: 34, type_name: '灾难片', type_en: 'disaster', type_pid: 2, type_sort: 34, type_status: 1 },
  { type_id: 35, type_name: '悬疑片', type_en: 'mystery', type_pid: 2, type_sort: 35, type_status: 1 },
  { type_id: 36, type_name: '犯罪片', type_en: 'crime', type_pid: 2, type_sort: 36, type_status: 1 },
  { type_id: 37, type_name: '奇幻片', type_en: 'fantasy', type_pid: 2, type_sort: 37, type_status: 1 },

  // 动漫子分类 (type_pid=17)
  { type_id: 24, type_name: '中国动漫', type_en: 'chinese-anime', type_pid: 17, type_sort: 24, type_status: 1 },
  { type_id: 25, type_name: '日本动漫', type_en: 'japanese-anime', type_pid: 17, type_sort: 25, type_status: 1 },
  { type_id: 26, type_name: '欧美动漫', type_en: 'western-anime', type_pid: 17, type_sort: 26, type_status: 1 },

  // 综艺子分类 (type_pid=27)
  { type_id: 30, type_name: '内地综艺', type_en: 'mainland-variety', type_pid: 27, type_sort: 30, type_status: 1 },
  { type_id: 31, type_name: '港台综艺', type_en: 'hk-tw-variety', type_pid: 27, type_sort: 31, type_status: 1 },
  { type_id: 32, type_name: '日韩综艺', type_en: 'jp-kr-variety', type_pid: 27, type_sort: 32, type_status: 1 },
  { type_id: 33, type_name: '欧美综艺', type_en: 'western-variety', type_pid: 27, type_sort: 33, type_status: 1 },
];

// 获取子分类
export function getSubCategories(parentId: number): Category[] {
  return ALL_CATEGORIES.filter(cat => cat.type_pid === parentId);
}

// 根据 ID 获取分类
export function getCategoryById(id: number): Category | undefined {
  return ALL_CATEGORIES.find(cat => cat.type_id === id);
}

// 根据英文名获取分类
export function getCategoryByEn(en: string): Category | undefined {
  return ALL_CATEGORIES.find(cat => cat.type_en === en);
}

// 构建树形结构
export function buildCategoryTree(): Category[] {
  const tree: Category[] = [];
  const primaryCategories = ALL_CATEGORIES.filter(cat => cat.type_pid === 0);
  
  primaryCategories.forEach(parent => {
    const children = getSubCategories(parent.type_id);
    tree.push({
      ...parent,
      children: children.length > 0 ? children : undefined,
    });
  });
  
  return tree;
}
