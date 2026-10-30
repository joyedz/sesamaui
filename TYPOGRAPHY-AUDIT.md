# Shared typography audit

All changes live in sesama-ui.css, forms.css, dashboard-components.css and library.css. Page demos inherit them.

| Role | Size / line | Weight |
| --- | --- | --- |
| UI text, inputs, select options, table cells, list content | 13 / 20px | 400 |
| Compact control text | 13 / 16px | 400; action buttons 500 |
| Headings, field labels, tree parent | Existing heading size; tree 13 / 20px | 500 |
| Tree child | 13 / 20px | 400 |
| Helper, errors, metadata, menu groups | 12 / 16px | 400 |
| Message content, Composer | 14 / 22px | 400 |
| Compact badges and avatar initials | Size-specific | 500 |

Reviewed: Button, Button group, Input, Input Field, Select, Combobox, Date Picker, Tag Input, Input area, Checkbox, Radio, Menu, Menu Item, Dropdown Menu, Popover, Command Palette, Tooltip, List row, Tree item, Table, Pagination, Badge, Chip, Label, Status dot, Avatar, Card, File card, Message, Composer, Banner, Empty State, Modal, Toast, Toolbar, Canvas, Loader, Skeleton, Tabs, Switch, Breadcrumbs, Divider and Wire. Non-text primitives keep their geometry. Captions in icon/size samples remain intentionally compact. Conversation text remains 14px. Tree roles keep parent 500 / child 400.
