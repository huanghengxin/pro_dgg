import {
  Tabs,
  TabPane,
  Steps,
  Step,
  TableColumn,
  Tag,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Rate,
  Form,
  FormItem,
  Input,
  Button,
  CheckboxGroup,
  CheckboxButton,
  Cascader,
  Message,
  Radio,
  RadioButton,
  Table,
  Tooltip,
  Dialog,
  Select,
  Option,
  DatePicker,
  TimePicker,
  TimeSelect,
  Switch,
  Checkbox,
  Loading,
  RadioGroup,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  MessageBox,
  InputNumber,
  Autocomplete,
  Progress,
  Popover,
  Col,
  Row,
  Image,
  InfiniteScroll,
  MenuItemGroup,
  Upload,
} from 'element-ui';

export default {
  install(V) {
    V.use(Autocomplete);
    V.use(Tag);
    V.use(TimeSelect);
    V.use(Switch);
    V.use(Select);
    V.use(Tabs);
    V.use(RadioGroup);
    V.use(TabPane);
    V.use(Steps);
    V.use(Step);
    V.use(Table);
    V.use(TableColumn);
    V.use(Container);
    V.use(MenuItem);
    V.use(DropdownMenu);
    V.use(Tooltip);
    V.use(Dropdown);
    V.use(Main);
    V.use(Menu);
    V.use(Submenu);
    V.use(DropdownItem);
    V.use(Header);
    V.use(Button);
    V.use(CheckboxGroup);
    V.use(Checkbox);
    V.use(Cascader);
    V.use(CheckboxButton);
    V.use(Input);
    V.use(Rate);
    V.use(Dialog);
    V.use(Radio);
    V.use(FormItem);
    V.use(Form);
    V.use(DatePicker);
    V.use(TimePicker);
    V.use(Aside);
    V.use(Footer);
    V.use(RadioButton);
    V.use(Option);
    V.use(Pagination);
    V.use(Breadcrumb);
    V.use(BreadcrumbItem);
    V.use(InputNumber);
    V.use(Progress);
    V.use(Popover);
    V.use(Col);
    V.use(Row);
    V.use(Image);
    V.use(Upload);
    V.use(MenuItemGroup);
    V.use(InfiniteScroll);
    V.use(Loading.directive);

    V.prototype.$message = Message;
    V.prototype.$messageBox = MessageBox;
    V.prototype.$loading = Loading.service;
  },
};
