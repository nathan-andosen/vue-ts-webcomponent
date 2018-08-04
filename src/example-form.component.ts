import { Vue, Component } from "vue-property-decorator";
import FooterComponent from './components/footer/footer.component.vue';
// import {MDCTextField} from '@material/textfield';




@Component({
  components: {
    'footer-component': FooterComponent
  }
})
export default class ExampleFormComponent extends Vue {
  text: string = "Testing";


  mounted() {
    
  }

}