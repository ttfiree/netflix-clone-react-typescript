/**
 * 将字符串转换为URL友好的slug
 * 例如: "复仇者联盟：终局之战" -> "fu-chou-zhe-lian-meng-zhong-ju-zhi-zhan"
 */
export function generateSlug(title: string, id?: number): string {
  if (!title) return id ? String(id) : '';
  
  // 移除特殊字符，保留中文、英文、数字
  let slug = title
    .toLowerCase()
    .trim()
    // 替换空格和特殊字符为连字符
    .replace(/[\s\/:：]+/g, '-')
    // 移除其他特殊字符
    .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, '')
    // 移除多余的连字符
    .replace(/-+/g, '-')
    // 移除首尾的连字符
    .replace(/^-|-$/g, '');
  
  // 如果slug为空或太短，使用ID
  if (!slug || slug.length < 2) {
    return id ? String(id) : 'movie';
  }
  
  // 限制长度（可选）
  if (slug.length > 100) {
    slug = slug.substring(0, 100).replace(/-[^-]*$/, '');
  }
  
  return slug;
}

/**
 * 生成完整的电影详情URL
 */
export function getMovieUrl(id: number, title: string): string {
  const slug = generateSlug(title, id);
  return `/movie/${id}/${slug}`;
}

/**
 * 从URL中提取电影ID
 */
export function extractMovieId(idParam: string): number {
  return parseInt(idParam, 10);
}
