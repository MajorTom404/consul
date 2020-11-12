import { inject as service } from '@ember/service';
import Route from 'consul-ui/routing/route';
import { hash } from 'rsvp';

export default class ServicesRoute extends Route {
  @service('data-source/service') data;

  async model(params, transition) {
    const dc = this.modelFor('dc').dc.Name;
    const nspace = this.modelFor('nspace').nspace.substr(1);
    const parent = this.routeName
      .split('.')
      .slice(0, -1)
      .join('.');
    const name = this.modelFor(parent).slug;
    const gatewayServices = await this.data.source(
      uri => uri`/${nspace}/${dc}/gateways/for-service/${name}`
    );
    return {
      dc,
      nspace,
      gatewayServices,
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.setProperties(model);
  }
}
