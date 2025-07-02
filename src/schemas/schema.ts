import { relations, sql } from "drizzle-orm";

import {
  boolean,
  customType,
  int,
  mysqlTable,
  timestamp,
  varchar,
  json,
  AnyMySqlColumn,
  text,
  double,
  date,
  mysqlEnum,
  serial,
  decimal,
} from "drizzle-orm/mysql-core";
import { number } from "zod";






export const userModel = mysqlTable("users", {
  userId: int("user_id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("PASSWORD", { length: 255 }).notNull(),
  active: boolean("active").notNull().default(true),
  roleId: int("role_id").references(() => roleModel.roleId, {
    onDelete: "set null",
  }),
   isPasswordResetRequired: boolean("is_password_reset_required").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});



export const userRelations = relations(userModel, ({ one, many }) => ({
  role: one(roleModel, {
    fields: [userModel.roleId],
    references: [roleModel.roleId],
  }),
  userCompanies: many(userCompanyModel),

}));
export const roleModel = mysqlTable("Roles", {
  roleId: int("role_id").primaryKey(),
  roleName: varchar("role_name", { length: 50 }).notNull(),
});


export const permissionsModel = mysqlTable("permissions", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});
export const rolePermissionsModel = mysqlTable("role_permissions", {
  roleId: int("role_id").references(() => roleModel.roleId),
  permissionId: int("permission_id").notNull().references(() => permissionsModel.id),
});
export const userRolesModel = mysqlTable("user_roles", {
  userId: int("user_id").notNull().references(() => userModel.userId),
  roleId: int("role_id").notNull().references(() => roleModel.roleId),
});
export const companyModel = mysqlTable("company", {
  companyId: int("company_id").primaryKey().autoincrement(),
  companyName: varchar("company_name", { length: 100 }).notNull().unique(),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 50 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
  taxId: varchar("tax_id", { length: 50 }),
  logo: text("logo"),
  parentCompanyId: int("parent_company_id").references(
    (): AnyMySqlColumn => companyModel.companyId,
    { onDelete: "set null" }
  ),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});

export const companyRelations = relations(companyModel, ({ one, many }) => ({
  parentCompany: one(companyModel, {
    fields: [companyModel.parentCompanyId],
    references: [companyModel.companyId],
  }),

  userCompanies: many(userCompanyModel),
}));


export const userCompanyModel = mysqlTable(
  "user_company",
  {
    userId: int("user_id")
      .notNull()
      .references(() => userModel.userId, { onDelete: "cascade" }),
    companyId: int("company_id")
      .notNull()
      .references(() => companyModel.companyId, { onDelete: "cascade" }),
  },
  (table) => ({
    primaryKey: [table.userId, table.companyId],
  })
);

export const userCompanyRelations = relations(userCompanyModel, ({ one }) => ({
  user: one(userModel, {
    fields: [userCompanyModel.userId],
    references: [userModel.userId],
  }),
  company: one(companyModel, {
    fields: [userCompanyModel.companyId],
    references: [companyModel.companyId],
  }),
}));
// Role ↔ Permissions
export const roleRelations = relations(roleModel, ({ many }) => ({
  rolePermissions: many(rolePermissionsModel),
}));

export const rolePermissionsRelations = relations(rolePermissionsModel, ({ one }) => ({
  role: one(roleModel, {
    fields: [rolePermissionsModel.roleId],
    references: [roleModel.roleId],
  }),
  permission: one(permissionsModel, {
    fields: [rolePermissionsModel.permissionId],
    references: [permissionsModel.id],
  }),
}));

// User ↔ Roles
export const userRolesRelations = relations(userRolesModel, ({ one }) => ({
  user: one(userModel, {
    fields: [userRolesModel.userId],
    references: [userModel.userId],
  }),
  role: one(roleModel, {
    fields: [userRolesModel.roleId],
    references: [roleModel.roleId],
  }),
}));

//Department
export const deparmentModel = mysqlTable("department", {
  departmentID: int("departmentID").autoincrement().primaryKey(),
  departmentName: varchar("departmentName", { length: 255 }).notNull(),
  budget: double("budget").default(0.0),
  companyCode: int("companyCode").references(() => companyModel.companyId),
  isActive: boolean("IsActive").default(true),
  startDate: date("StartDate"),
  endDate: date("EndDate"),
  createdBy: int("CreatedBy").notNull(),
  createdAt: timestamp("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  updatedBy: int("UpdatedBy"),
  actual: double("Actual").default(0.0),
});

//department - user 

export const depuserRelation = relations(deparmentModel, ({ one }) => ({
  creator: one(userModel, {
    fields: [deparmentModel.createdBy],
    references: [userModel.userId],
  }),
}));
// department - company

export const depcomRelations = relations(deparmentModel, ({ one }) => ({
  creator: one(companyModel, {
    fields: [deparmentModel.companyCode],
    references: [companyModel.companyId],
  }),
}));

export const costCenterModel = mysqlTable("costcenters", {
  costCenterId: int("costCenterID").primaryKey().autoincrement(),
  costCenterName: varchar("costCenterName", { length: 255 }).notNull(),
  costCenterDescription: varchar("costCenterDescription",{length:255}),
  budget: double("budget", { precision: 18, scale: 2 }).default(0.00),
  actual: double("actual", { precision: 18, scale: 2 }).default(0.00),
  companyCode: int("companyCode").references(() => companyModel.companyId),
  isActive: boolean("isActive"),
  isVehicle: boolean("isVehicle"),
  startDate: date("StartDate"),
  endDate: date("EndDate"),
  createdBy: int("CreatedBy").notNull(),
  createdAt: timestamp("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  updatedBy: int("UpdatedBy"),
  updatedAt: timestamp("UpdatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
});

// costcenter - company

export const cccomRelations = relations(costCenterModel, ({ one }) => ({
  creator: one(companyModel, {
    fields: [costCenterModel.companyCode],
    references: [companyModel.companyId],
  }),
}));

export const assetCategoryModel = mysqlTable('asset_category', {
  category_id: int('category_id',).primaryKey().autoincrement(),
  category_name: varchar('category_name', { length: 255 }).notNull(),
  depreciation_rate: double('depreciation_rate', { precision: 5, scale: 2 }),
  account_code: varchar('account_code',{length:30}),
  depreciation_account_code: varchar('depreciation_account_code',{length:30}),
  parent_cat_code:int('parent_cat_code').references(
    (): AnyMySqlColumn => assetCategoryModel.category_id,
    { onDelete: "set null" }
  ),
  created_by: int('created_by').notNull(),
  created_time: timestamp('created_time').default(sql`CURRENT_TIMESTAMP`),
  updated_by: int('updated_by'),
  updated_time: timestamp('updated_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
}
);
 //category -category self relation
 export const CategoryRelations = relations(assetCategoryModel, ({ one, many }) => ({
  parentCategory: one(assetCategoryModel, {
    fields: [assetCategoryModel.parent_cat_code],
    references: [assetCategoryModel.category_id],
  })
}));

export const supplierModel = mysqlTable("supplier", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  type:  mysqlEnum("type", ["Supplier", "Manufacturer"]).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  website: varchar("website", { length: 255 }),
  isCompany: boolean("is_company").default(true),
  vat: varchar("vat", { length: 100 }),
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  zip: varchar("zip", { length: 20 }),
  active: boolean("active").default(true),
  comment: text("comment"),
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedBy: int("updated_by"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const sectionModel = mysqlTable("section", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),})

  export const countryModel = mysqlTable("country", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }),})

  export const locationModel = mysqlTable("location", {
      id: int("id").primaryKey().autoincrement(),
      name: varchar("name", { length: 255 }),})

  export const assetModel = mysqlTable('asset', {
        id: int('id').primaryKey().autoincrement(),
        assetCode: varchar('asset_code', { length: 100 }).notNull(),
        assetName: varchar('asset_name', { length: 255 }).notNull(),
        startDate: date('dep_start_date'),
        purDate: date('purDate').notNull(),
        categoryId: int('category_id').references(() => assetCategoryModel.category_id).notNull(),
        subCatagoryId: int('sub_category_id').references(() => assetCategoryModel.category_id),
        supplierId: int('supplier_id').references(() => supplierModel.id),
        user: varchar('user',{length:100}),
        companyId:int('company_id').references(()=>companyModel.companyId),
        locationId: int('location_id').references(() => locationModel.id),
        sectionId: int('section_id').references(() => sectionModel.id),
        departmentId: int('department_id').references(() => deparmentModel.departmentID),
        assetValue: double('asset_value', { precision: 15, scale: 2 }).notNull(),
        currentValue: double('current_value', { precision: 15, scale: 2 }),
        depRate: double('dep_rate', { precision: 5, scale: 2 }),
        salvageValue: double('salvage_value', { precision: 15, scale: 2 }),
        status: varchar('status', { length: 50 }),
        soldDate: date('sold_date'),
        soldValue: double('sold_value', { precision: 15, scale: 2 }),
        mfgCode: int('mfg_code').references(() => supplierModel.id),
        mfgYear: int('mfg_year'),
        countryCode: int('country_code').references(() => countryModel.id),
        model: varchar('model', { length: 255 }),
        slNo: varchar('sl_no', { length: 255 }),
        costCenterId:int('cost_center').references(()=>costCenterModel.costCenterId),
        assetGlCode: varchar('asset_gl_code', { length: 100 }),
        notes: varchar('notes', { length: 500 }),
        createdBy: int("created_by"),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
        updatedBy: int("updated_by"),
        updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
      });
      
      // Asset relations
      export const AssetRelations = relations(assetModel, ({ one }) => ({
        category: one(assetCategoryModel, {
          fields: [assetModel.categoryId],
          references: [assetCategoryModel.category_id],
        }),
        supplier: one(supplierModel, {
          fields: [assetModel.supplierId],
          references: [supplierModel.id],
          relationName: 'supplier_supplier',
        }),
       
        location: one(locationModel, {
          fields: [assetModel.locationId],
          references: [locationModel.id],
        }),
        section: one(sectionModel, {
          fields: [assetModel.sectionId],
          references: [sectionModel.id],
        }),
        department: one(deparmentModel, {
          fields: [assetModel.departmentId],
          references: [deparmentModel.departmentID],
        }),
        country: one(countryModel, {
          fields: [assetModel.countryCode],
          references: [countryModel.id],
        }),
      }));

      //Depreciation Books Table
     
export const depreciationBookModel = mysqlTable('depreciation_Book', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  companyId: int('company_id'),
  depFreq: mysqlEnum('dep_freq', ['Monthly', 'Yearly']).notNull(),
  isActive: boolean('is_active').default(true),
  createdBy: int("created_by"),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const depreciationInfoModel = mysqlTable('depreciation_Info', {
  id: int('id').primaryKey().autoincrement(),
  assetId: int('asset_id').notNull().references(() => assetModel.id),
  bookId: int('book_id').notNull().references(() => depreciationBookModel.id),
  depreciationMethod: mysqlEnum('depreciation_method', ['Straight Line', 'Declining Balance']).notNull(),
  depreciationRate: double('depreciation_rate', { precision: 5, scale: 2 }),
  usefulLifeMonths: int('useful_life_months'),
  residualValue: double('residual_value', { precision: 12, scale: 2 }),
  effectiveDate: date('effective_date').notNull(),
  startingValue: double('current_value', { precision: 18, scale: 2 }).notNull(),
  accDepValue: double('acc_dep', { precision: 18, scale: 2 }).notNull(),
  createdBy: int("created_by"),
  createdAt: timestamp('created_at').defaultNow(),
});
// DepreciationTransaction
export const depreciationTransactionModel = mysqlTable('depreciation_Transaction', {
  id: int('id').primaryKey().autoincrement(),
  assetId: int('asset_id').notNull().references(() => assetModel.id),
  bookId: int('book_id').notNull().references(() => depreciationBookModel.id),
  transactionDate: date('transaction_date').notNull(),
  period: varchar('period', { length: 10 }).notNull(), // e.g., '2025-05'
  depreciationAmount: double('depreciation_amount', { precision: 14, scale: 2 }).notNull(),
  notes: text('notes'),
  wdb:double('wdb'),
  createdBy: int("created_by"),
  createdAt: timestamp('created_at').defaultNow(),
});
// DepreciationBalance
export const depreciationBalance = mysqlTable('depreciation_Balance', {
  id: int('id').primaryKey(),
  assetId: int('asset_id').notNull().references(() => assetModel.id),
  bookId: int('book_id').notNull().references(() => depreciationBookModel.id),
  totalDepreciation: double('total_depreciation', { precision: 14, scale: 2 }).default(0),
  netBookValue: double('net_book_value', { precision: 14, scale: 2 }).notNull(),
  lastDepreciationDate: date('last_depreciation_date'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
// AssetEvent
export const assetEvent = mysqlTable('AssetEvent', {
  id: int('id').primaryKey(),
  assetId: int('asset_id').notNull().references(() => assetModel.id),
  eventDate: date('event_date').notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // e.g., 'Revaluation', 'Disposal'
  description: text('description'),
  amount: double('amount', { precision: 14, scale: 2 }), // optional impact value
  bookId: int('book_id').references(() => depreciationBookModel.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const warrantyModel = mysqlTable("warranty", {
  id: serial("id").primaryKey(),
  asset_id: int("asset_id")
    .notNull()
    .references(() => assetModel.id),
  type:mysqlEnum("warranty_type", [
  "Standard Warranty",
  "Extended Warranty",
]).notNull(),
  start_date: date("start_date").notNull(),
  end_date: date("end_date").notNull(),
  warranty_provider: text("warranty_provider").notNull(), // address + phone + email
  description: varchar("description", { length: 500 }),
});

// Define enum for maintenance type


// Define the maintenance table
export const maintenanceModel = mysqlTable("maintenance", {
  id: serial("id").primaryKey(),
  assetId: int("asset_id")
    .notNull()
    .references(() => assetModel.id),
  maintDate: date("maint_date").notNull(),
  type: mysqlEnum("maintenance_type", [
  "Preventive",
  "Corrective",
  "Condition-based",
]),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
    description: text("description"),
  performedBy: varchar("performed_by", { length: 255 }).notNull(),
});

// Dispose table definition
export const disposeModel = mysqlTable("dispose", {
  id: serial("id").primaryKey(),
  asset_id: int("asset_id")
    .notNull()
    .references(() => assetModel.id),
  dispose_date: date("dispose_date").notNull(),
  reason: text("reason").notNull(),
  method:  mysqlEnum("dispose_method", [
  "Sell",
  "Scrap",
  "Donate",
  "Transfer",
]).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  remarks: text("remarks"),
  performed_by: varchar("performed_by", { length: 255 }).notNull(),
});

export const assetCapexAdditionModel = mysqlTable('asset_capex_addition', {
  id: int('id').primaryKey().autoincrement(),
  assetId: int('asset_id').notNull().references(() => assetModel.id),
  additionDate: date('addition_date').notNull(),
  addedValue: double('added_value', { precision: 15, scale: 2 }).notNull(),
  description: text('description'),
  newBookValue: double('new_book_value', { precision: 15, scale: 2 }),
  supplierId: int('supplier_id').references(() => supplierModel.id),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow()
});

export const assetPartialRetirementModel = mysqlTable('asset_retirement_log', {
  id: int('id').primaryKey().autoincrement(),
  assetId: int('asset_id').notNull().references(() => assetModel.id),
  retirementDate: date('retirement_date').notNull(),
  retiredValue: double('retired_value', { precision: 15, scale: 2 }).notNull(),
  reason: text('reason'),
  updatedBookValue: double('updated_book_value', { precision: 15, scale: 2 }),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow()
});




export type User = typeof userModel.$inferSelect;
export type NewUser = typeof userModel.$inferInsert;
export type Role = typeof roleModel.$inferSelect;
export type NewRole = typeof roleModel.$inferInsert;
export type Company = typeof companyModel.$inferSelect;
export type NewCompany = typeof companyModel.$inferInsert;
export type Department = typeof deparmentModel.$inferSelect;
export type NewDepartment = typeof deparmentModel.$inferInsert;
export type CostCenter = typeof costCenterModel.$inferSelect;
export type NewCostCenter = typeof costCenterModel.$inferInsert;
export type Category = typeof assetCategoryModel.$inferSelect;
export type NewCategory = typeof assetCategoryModel.$inferInsert;
export type Supplier = typeof supplierModel.$inferSelect;
export type NewSupplier = typeof supplierModel.$inferInsert;
export type Section = typeof sectionModel.$inferSelect;
export type NewSection = typeof sectionModel.$inferInsert;
export type Country = typeof countryModel.$inferSelect;
export type NewCountry = typeof countryModel.$inferInsert;
export type Location = typeof locationModel.$inferSelect;
export type NewLocation = typeof locationModel.$inferInsert;
export type Asset = typeof assetModel.$inferSelect;
export type NewAsset = typeof assetModel.$inferInsert;
export type DepBook = typeof depreciationBookModel.$inferSelect;
export type NewDepBook = typeof depreciationBookModel.$inferInsert;
export type DepInfo = typeof depreciationInfoModel.$inferSelect;
export type NewDepInfo = typeof depreciationInfoModel.$inferInsert;
export type DepTrac = typeof depreciationTransactionModel.$inferSelect;
export type NewDepTrac = typeof depreciationTransactionModel.$inferInsert;
export type AssetWarranty = typeof warrantyModel.$inferSelect;
export type NewAssetWarranty = typeof warrantyModel.$inferInsert;
export type AssetMaint = typeof maintenanceModel.$inferSelect;
export type NewAssetMaint = typeof maintenanceModel.$inferInsert;
export type AssetDispose = typeof disposeModel.$inferSelect;
export type NewAssetDispose = typeof disposeModel.$inferInsert;
export type AssetAddition = typeof assetCapexAdditionModel.$inferSelect;
export type NewAssetAddition = typeof assetCapexAdditionModel.$inferInsert;
export type AssetRetirement = typeof assetPartialRetirementModel.$inferSelect;
export type NewAssetRetirement = typeof assetPartialRetirementModel.$inferInsert;