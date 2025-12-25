import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Promotion = Tables<"promotions">;
export type PromotionInsert = TablesInsert<"promotions">;
export type PromotionUpdate = TablesUpdate<"promotions">;

export const promotionService = {
  async getAll() {
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getActive() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .lte("starts_at", now)
      .or(`expires_at.is.null,expires_at.gte.${now}`);
    
    if (error) throw error;
    return data;
  },

  async getByCode(code: string) {
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async validateCode(code: string, orderTotal: number) {
    try {
      const promo = await this.getByCode(code);
      
      if (!promo) return { valid: false, message: "Invalid promo code" };
      
      const now = new Date();
      if (promo.starts_at && new Date(promo.starts_at) > now) {
        return { valid: false, message: "This promo code is not yet active" };
      }
      
      if (promo.expires_at && new Date(promo.expires_at) < now) {
        return { valid: false, message: "This promo code has expired" };
      }
      
      if (promo.max_uses && promo.current_uses && promo.current_uses >= promo.max_uses) {
        return { valid: false, message: "This promo code has reached its usage limit" };
      }
      
      if (promo.min_order_amount && orderTotal < Number(promo.min_order_amount)) {
        return { 
          valid: false, 
          message: `Minimum order amount is $${promo.min_order_amount}` 
        };
      }

      let discount = 0;
      if (promo.discount_type === "percentage") {
        discount = orderTotal * (Number(promo.discount_value) / 100);
      } else {
        discount = Number(promo.discount_value);
      }

      return { valid: true, discount, promo };
    } catch {
      return { valid: false, message: "Invalid promo code" };
    }
  },

  async create(promotion: PromotionInsert) {
    const { data, error } = await supabase
      .from("promotions")
      .insert({ ...promotion, code: promotion.code.toUpperCase() })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, promotion: PromotionUpdate) {
    const updateData = { ...promotion };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    
    const { data, error } = await supabase
      .from("promotions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  async incrementUsage(id: string) {
    const { data: promo } = await supabase
      .from("promotions")
      .select("current_uses")
      .eq("id", id)
      .single();
    
    if (promo) {
      await supabase
        .from("promotions")
        .update({ current_uses: (promo.current_uses || 0) + 1 })
        .eq("id", id);
    }
  },
};
