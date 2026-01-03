import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type LoyaltyPoints = Tables<"loyalty_points">;
export type LoyaltyTransaction = Tables<"loyalty_transactions">;
export type LoyaltyTransactionInsert = TablesInsert<"loyalty_transactions">;

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  platinum: 5000,
};

export const POINTS_PER_DOLLAR = 10;

export const loyaltyService = {
  async getPoints(userId: string) {
    const { data, error } = await supabase
      .from("loyalty_points")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async earnPoints(userId: string, orderId: string, orderTotal: number) {
    const pointsEarned = Math.floor(orderTotal * POINTS_PER_DOLLAR);
    
    // Get current points
    const current = await this.getPoints(userId);
    const newTotal = (current?.total_points || 0) + pointsEarned;
    
    // Calculate new tier
    let newTier: LoyaltyTier = "bronze";
    if (newTotal >= TIER_THRESHOLDS.platinum) newTier = "platinum";
    else if (newTotal >= TIER_THRESHOLDS.gold) newTier = "gold";
    else if (newTotal >= TIER_THRESHOLDS.silver) newTier = "silver";
    
    // Update or insert points
    const { error: pointsError } = await supabase
      .from("loyalty_points")
      .upsert({
        user_id: userId,
        total_points: newTotal,
        tier: newTier,
      });
    
    if (pointsError) throw pointsError;
    
    // Record transaction
    const { error: transactionError } = await supabase
      .from("loyalty_transactions")
      .insert({
        user_id: userId,
        order_id: orderId,
        points: pointsEarned,
        transaction_type: "earned",
        description: `Earned from order`,
      });
    
    if (transactionError) throw transactionError;
    
    return { pointsEarned, newTotal, newTier };
  },

  async redeemPoints(userId: string, points: number, description: string) {
    const current = await this.getPoints(userId);
    if (!current || current.total_points < points) {
      throw new Error("Insufficient points");
    }
    
    const newTotal = current.total_points - points;
    
    // Update points
    const { error: pointsError } = await supabase
      .from("loyalty_points")
      .update({ total_points: newTotal })
      .eq("user_id", userId);
    
    if (pointsError) throw pointsError;
    
    // Record transaction
    const { error: transactionError } = await supabase
      .from("loyalty_transactions")
      .insert({
        user_id: userId,
        points: -points,
        transaction_type: "redeemed",
        description,
      });
    
    if (transactionError) throw transactionError;
    
    return { pointsRedeemed: points, newTotal };
  },

  async addBonusPoints(userId: string, points: number, description: string) {
    const current = await this.getPoints(userId);
    const newTotal = (current?.total_points || 0) + points;
    
    // Calculate new tier
    let newTier: LoyaltyTier = "bronze";
    if (newTotal >= TIER_THRESHOLDS.platinum) newTier = "platinum";
    else if (newTotal >= TIER_THRESHOLDS.gold) newTier = "gold";
    else if (newTotal >= TIER_THRESHOLDS.silver) newTier = "silver";
    
    // Update points
    const { error: pointsError } = await supabase
      .from("loyalty_points")
      .upsert({
        user_id: userId,
        total_points: newTotal,
        tier: newTier,
      });
    
    if (pointsError) throw pointsError;
    
    // Record transaction
    const { error: transactionError } = await supabase
      .from("loyalty_transactions")
      .insert({
        user_id: userId,
        points,
        transaction_type: "bonus",
        description,
      });
    
    if (transactionError) throw transactionError;
    
    return { pointsAdded: points, newTotal, newTier };
  },
};
