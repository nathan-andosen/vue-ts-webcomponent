import { Vue, Component } from "vue-property-decorator";
import FooterComponent from './components/footer/footer.component.vue';

@Component({
  components: {
    'footer-component': FooterComponent
  }
})
export default class ExampleFormComponent extends Vue {

}