-- =================================================================
-- IMPORT MATERIALS AND COLORS
-- Copy and paste this entire file into your Supabase Dashboard SQL Editor
-- Then click "Run" to apply the changes
-- =================================================================

-- Insert Materials
INSERT INTO public.materials (id, name, category, cost_per_gram, upcharge, is_active) VALUES
('ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', 'PLA Basic', 'standard', 0.0300, 0.00, true),
('1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', 'PLA Matte', 'premium', 0.0400, 2.00, true),
('76c9b429-c29f-447a-868d-78bfb484b213', 'PLA Glow', 'premium', 0.0500, 3.00, true),
('091c3819-5f68-4823-9ef8-ac0a87451b73', 'PETG Translucent', 'premium', 0.0500, 2.50, true),
('04b2703f-4d62-470f-a78b-78016bee41ee', 'PLA Silk Multi-Color', 'premium', 0.0600, 4.00, true),
('11d143f0-8af4-4a44-a9ce-b772efa0ed27', 'PLA Basic Gradient', 'premium', 0.0400, 2.00, true),
('0371f01c-dc95-401a-99a2-157c898bcd05', 'Silk PLA+', 'premium', 0.0500, 3.00, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    cost_per_gram = EXCLUDED.cost_per_gram,
    upcharge = EXCLUDED.upcharge,
    is_active = EXCLUDED.is_active;

-- Insert Colors
INSERT INTO public.colors (id, name, hex_color, material_id, is_active) VALUES
('4a365bbf-c2e0-4bbb-b75a-af80bf7e33b6', 'Light Gray', '#D3D3D3', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('95bd1ea4-50a8-45b0-a4eb-a9d4e59879d5', 'Pink', '#F4A6C1', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('d09c8d34-1cb9-4bf2-9588-188119b52106', 'Purple', '#8A2BE2', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('b2196ba6-6469-4ec7-9523-46075f3770b5', 'Turquoise', '#40E0D0', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('fd2b2a59-ad1a-45b6-9f39-ded5c1fcf9f5', 'Bone White', '#EDE6D6', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('40932e3c-062f-4884-b5f3-d8521382d9ec', 'Black', '#000000', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('a7f38146-bd32-461d-9ded-200d2dce02f1', 'Jade White', '#F4F8F4', 'ebac1b11-b67c-4cc1-96b1-43e20bdc7d7c', true),
('44b634f0-9d27-4ebd-8fdb-24ba885ee665', 'Matte Terracotta', '#B85C38', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('8366ee20-2dfd-4402-8cb2-9fc1977db026', 'Matte Mandarin Orange', '#F47C20', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('24d23ee7-e04a-411c-a207-9b7c500b0688', 'Matte Nardo Gray', '#A6A6A6', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('f457dfd8-c77f-4f32-88fd-a5d4ab6586da', 'Matte Charcoal', '#333333', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('4a1c4141-c8c2-4100-9617-5578daedee4a', 'Matte Ivory White', '#F7F5E8', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('3cecc6ef-0c54-4487-8632-bc448c86499e', 'Ruby Red', '#9B111E', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('b5032ead-1c4c-4b69-b24a-fee9ad3ab959', 'Navy Blue', '#1A2C56', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('a1e74a5a-fd2b-4fd1-beef-1ec7ac39386c', 'Mint Green', '#B0E0A8', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('dbc248c4-e6c5-4661-8c9f-814490f678c5', 'Lavender Purple', '#C8A2C8', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('566b7218-f9c8-48b8-b902-b7485f4d9491', 'Sakura Pink', '#F7C1CC', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('9574b172-be2b-440a-85c9-b74e46993ee3', 'Sunshine Yellow', '#FFD93B', '1e29b2ce-fc5d-42d8-99b2-be5bf3e1e0b5', true),
('d1212fff-ef4a-4cea-a1e9-3b0397aad662', 'Glow Orange', '#FFA64D', '76c9b429-c29f-447a-868d-78bfb484b213', true),
('8565daad-44e9-4685-a420-7faa784e662c', 'Translucent Light Blue', '#AEE4F7', '091c3819-5f68-4823-9ef8-ac0a87451b73', true),
('1dc89986-ab73-4883-be7d-fad6763c51df', 'Midnight Blaze', '#151B54', '04b2703f-4d62-470f-a78b-78016bee41ee', true),
('491b8b9b-0494-4dab-97bf-e0b3dced5aa9', 'Blue Hawaii', '#0C5DA5', '04b2703f-4d62-470f-a78b-78016bee41ee', true),
('24b84d6d-baa9-4643-8b1c-d5ebaab689a7', 'Gilded Rose', '#D98C8C', '04b2703f-4d62-470f-a78b-78016bee41ee', true),
('e274cdb3-abcc-48b5-9562-76708307639d', 'Ocean to Meadow', '#0099CC', '11d143f0-8af4-4a44-a9ce-b772efa0ed27', true),
('b34fd556-3993-403c-b8af-6a6a8ed4c6a3', 'Gold', '#FFD700', '0371f01c-dc95-401a-99a2-157c898bcd05', true),
('4e9df6ce-3e89-4680-bab4-dd960bf3ce37', 'Red (Silk Multicolor)', '#E31E26', '0371f01c-dc95-401a-99a2-157c898bcd05', true),
('01f97205-eb0f-420c-ab3d-62210f8d0295', 'Blue (Silk Multicolor)', '#0072CE', '0371f01c-dc95-401a-99a2-157c898bcd05', true),
('96223303-3647-43d7-9d79-4f6b274f97af', 'Green (Silk Multicolor)', '#00B050', '0371f01c-dc95-401a-99a2-157c898bcd05', true),
('8ccc8f9c-250e-4d38-8064-47cfc25dd1e2', 'Purple (Silk Multicolor)', '#800080', '0371f01c-dc95-401a-99a2-157c898bcd05', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    hex_color = EXCLUDED.hex_color,
    material_id = EXCLUDED.material_id,
    is_active = EXCLUDED.is_active;

-- Verification
SELECT 
    (SELECT count(*) FROM materials) as total_materials,
    (SELECT count(*) FROM colors) as total_colors;

