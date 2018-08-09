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

  data!: iData;
  @Prop() title!: string;

  /**
   * Creates an instance of ExampleFormComponent.
   * 
   * @memberof ExampleFormComponent
   */
  constructor() {
    super();
    if(typeof this.data === 'string') {
      this.data = JSON.parse(this.data);
    }
    this.data = (this.data) ? this.data : {};
    this.title = (this.title) ? this.title : 'Welcome!';
  }


  /**
   * Get the data as a json object
   *
   * @private
   * @returns {iData}
   * @memberof ExampleFormComponent
   */
  private getData(): iData {
    return JSON.parse(JSON.stringify(this.data));
  }


  /**
   * This function will be exposed onto the custom element
   *
   * @private
   * @param {iData} data
   * @memberof ExampleFormComponent
   */
  private passData(data: iData) {
    this.data = data;
  }


  /**
   * Submit the form
   *
   * @memberof ExampleFormComponent
   */
  submitForm() {
    this.$emit('example-form-submit', this.getData());
  }
}