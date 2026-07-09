import Recommendation from "../models/recommendationModel";
import mysqlPool from "../database/mysql";

interface RecommendationItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  score?: number;
}

export const getRecommendationsForUser = async (
  userId: number,
): Promise<RecommendationItem[]> => {
  try {
    const userIdString = String(userId);
    const recommendation = await Recommendation.findOne({
      user_id: userIdString,
    }).lean();

    if (!recommendation || !recommendation.viewed_dishes.length) {
      // Return top products if no user history
      const [rows] = await mysqlPool.query(
        "SELECT id, product_name AS name, description, base_price AS price, image_url FROM products ORDER BY best_seller DESC, created_at DESC LIMIT 8",
      );
      return rows as RecommendationItem[];
    }

    const sortedViewed = recommendation.viewed_dishes
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => item.food_id);

    if (sortedViewed.length === 0) {
      // Fallback to top products if no valid product IDs
      const [rows] = await mysqlPool.query(
        "SELECT id, product_name AS name, description, base_price AS price, image_url FROM products ORDER BY best_seller DESC, created_at DESC LIMIT 8",
      );
      return rows as RecommendationItem[];
    }

    // Build IN clause properly for MySQL
    const placeholders = sortedViewed.map(() => '?').join(',');
    const [favoriteRowsRaw] = await mysqlPool.query(
      `SELECT id, product_name AS name, description, base_price AS price, image_url FROM products WHERE id IN (${placeholders})`,
      sortedViewed,
    );
    const favoriteRows = favoriteRowsRaw as RecommendationItem[];

    // Get best sellers to fill remaining slots
    const favoriteIds = new Set(favoriteRows.map((item) => item.id));
    const remainingSlots = 8 - favoriteRows.length;

    if (remainingSlots > 0) {
      const [bestSellersRaw] = await mysqlPool.query(
        `SELECT id, product_name AS name, description, base_price AS price, image_url FROM products
         WHERE ${favoriteIds.size > 0 ? `id NOT IN (${[...favoriteIds].map(() => '?').join(',')})` : 'TRUE'}
         ORDER BY best_seller DESC, created_at DESC LIMIT ?`,
        favoriteIds.size > 0 ? [...favoriteIds, remainingSlots] : [remainingSlots],
      );
      const bestSellers = bestSellersRaw as RecommendationItem[];

      return [...favoriteRows, ...bestSellers];
    }

    return favoriteRows.slice(0, 8);
  } catch (error) {
    console.error('Error in getRecommendationsForUser:', error);
    // Fallback to top products on any error
    try {
      const [rows] = await mysqlPool.query(
        "SELECT id, product_name AS name, description, base_price AS price, image_url FROM products ORDER BY best_seller DESC, created_at DESC LIMIT 8",
      );
      return rows as RecommendationItem[];
    } catch (fallbackError) {
      console.error('Fallback recommendation query failed:', fallbackError);
      return [];
    }
  }
};

export const recordViewedDish = async (userId: number, foodId: number) => {
  try {
    const userIdString = String(userId);
    const recommendation = await Recommendation.findOne({
      user_id: userIdString,
    });

    if (!recommendation) {
      await Recommendation.create({
        user_id: userIdString,
        viewed_dishes: [{ food_id: foodId, count: 1 }],
      });
      return;
    }

    const dish = recommendation.viewed_dishes.find(
      (item) => item.food_id === foodId,
    );
    if (dish) {
      dish.count += 1;
    } else {
      recommendation.viewed_dishes.push({ food_id: foodId, count: 1 });
    }

    await recommendation.save();
  } catch (error) {
    console.error('Error recording viewed dish:', error);
    // Silently fail - don't break the main flow if MongoDB is unavailable
  }
};
