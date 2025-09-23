import { supabase } from "../config/supabaseClient.js";

export const MedicationModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("medications")
      .select(
        "id, sku, name, description, price, quantity, category_id, supplier_id"
      );
    if (error) throw error;
    return data;
  },

  async getAllWithPagination(name, page, limit) {
    try {
      let query = supabase
        .from("medications")
        .select(
          "id, sku, name, description, price, quantity, category_id, supplier_id",
          { count: "exact" }
        );

      // Add search filter if name is provided
      if (name && name.trim() !== "") {
        query = query.ilike("name", `%${name.trim()}%`);
      }

      const countQuery = query;
      const { count, error: countError } = await countQuery.select("*", {
        count: "exact",
        head: true,
      });

      if (countError) throw countError;

      const totalCount = count || 0;

      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query.range(from, to);
      if (error) throw error;

      return {
        medications: data || [],
        totalCount: count,
      };
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("medications")
      .select(
        `
id, sku, name, description, price, quantity,
categories ( id, name ),
suppliers ( id, name, email, phone ),
`
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    // Validate quantity and price
    if (payload.quantity !== undefined && payload.quantity < 0) {
      throw new Error("Quantity cannot be less than 0");
    }

    if (payload.price !== undefined && payload.price < 0) {
      throw new Error("Price cannot be less than 0");
    }

    const { data, error } = await supabase
      .from("medications")
      .insert([payload])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, payload) {
    // Validate quantity and price
    if (payload.quantity !== undefined && payload.quantity < 0) {
      throw new Error("Quantity cannot be less than 0");
    }

    if (payload.price !== undefined && payload.price < 0) {
      throw new Error("Price cannot be less than 0");
    }

    const { data, error } = await supabase
      .from("medications")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async remove(id) {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },

  async getTotalCount() {
    const { count, error } = await supabase
      .from("medications")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count;
  },
};
