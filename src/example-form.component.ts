import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import FooterComponent from './components/footer/footer.component.vue';


interface iData {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

@Component({
  components: {
    'footer-component': FooterComponent
  }
})
export default class ExampleFormComponent extends Vue {
  email: string = "";
  password: string = "";
  rememberMe: boolean = false;

  @Prop() data!: iData;
  @Prop() title!: string;

  constructor() {
    super();
    if(typeof this.data === 'string') {
      this.data = JSON.parse(this.data);
    }
    this.data = (this.data) ? this.data : {};
    this.title = (this.title) ? this.title : 'Welcome!';
  }

  private getData(): iData {
    return JSON.parse(JSON.stringify(this.data));
  }

  @Watch('data')
  onDataChanged(val: iData, oldVal: iData) {
    console.log('Data changed', this.getData());
  }

  submitForm() {
    // console.log(this.email, this.password, this.rememberMe);
    this.$emit('example-form-submit', this.getData());
  }
}