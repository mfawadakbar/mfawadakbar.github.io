import { Aurelia } from "aurelia-framework";
import environment from "./environment";
import { PLATFORM } from "aurelia-pal";

// Build a font-awesome library for project-wide use.
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faBars, faPhone, faMapMarker, faEnvelope } from "@fortawesome/free-solid-svg-icons";
library.add(fab, faBars, faPhone, faMapMarker, faEnvelope);

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName("aurelia-fontawesome"))
    .feature(PLATFORM.moduleName("resources/index"));

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName("aurelia-testing"));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app")));
}
