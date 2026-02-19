# Data Shape

## Entities

### Tenant
A customer organization using the platform. Each tenant has its own configuration, users, and data, fully isolated from other tenants.

### User
A person who accesses the platform within a tenant. Users have roles that determine their permissions and the experience they see (creator, manager, executive, sourcer, etc.).

### Product
The top-level item being brought to market. A product is the central entity that connects specifications, materials, sourcing, timelines, and reporting. What constitutes a "product" is defined by the tenant's vertical and configuration.

### Style
A specific variant or expression of a product — such as a colorway in fashion, a flavor in food, or a formulation in chemicals. Styles inherit from their parent product but carry their own attributes and specifications.

### Specification
A structured set of attributes that define the requirements for a product or style — dimensions, tolerances, compositions, packaging requirements, and other technical details.

### Attribute
A configurable field that can be attached to any entity. Tenants define their own attribute types (text, number, dropdown, image, etc.) to model their vertical's unique data needs.

### Material
A raw material, component, ingredient, or sub-assembly used in manufacturing a product. Materials have their own specifications, suppliers, and cost data.

### BillOfMaterials
The hierarchical breakdown of all materials, components, and packaging required to manufacture a specific product or style, including quantities, costs, and sourcing details.

### Supplier
An external organization that provides materials, components, or manufacturing services. Suppliers have profiles with capabilities, certifications, compliance records, and performance history.

### Factory
A specific manufacturing or production facility operated by a supplier. Factories have location, capacity, certification, and lead time information.

### Quote
A pricing proposal from a supplier or factory for manufacturing a product or providing materials, submitted in response to an RFQ. Quotes include unit costs, MOQs, lead times, and terms.

### RequestForQuote
A formal request sent to one or more suppliers asking for pricing and terms on a specific product, style, or material. RFQs track status, responses, and selection decisions.

### Document
A file or attachment associated with any entity — tech packs, CAD files, lab reports, images, certificates, or any other supporting documentation.

### Milestone
A key checkpoint or deadline in the product development timeline — concept review, sample approval, production start, ship date, etc. Milestones can require approvals from specific roles.

### Calendar
A timeline view that aggregates milestones, deadlines, and development stages across products, providing visibility into the overall product development schedule.

### Workflow
A configurable sequence of stages and approval gates that governs how an entity (product, quote, milestone, etc.) moves through its lifecycle. Tenants define their own workflows.

## Relationships

- Tenant has many User
- Tenant has many Product
- Tenant has many Supplier
- Tenant has many Workflow
- Product has many Style
- Product has one BillOfMaterials
- Product has many Specification
- Product has many Document
- Product has many Milestone
- Style has many Specification
- Style has many Document
- Style has one BillOfMaterials
- BillOfMaterials has many Material
- Material has many Supplier
- Material has many Document
- Supplier has many Factory
- Supplier has many Quote
- Factory has many Quote
- RequestForQuote has many Quote
- RequestForQuote belongs to Product or Material
- Milestone belongs to Product or Style
- Calendar aggregates Milestone across Product
- Workflow governs Product, Quote, Milestone, and other configurable entities
- Specification has many Attribute
- Product has many Attribute
- Style has many Attribute
- Material has many Attribute
