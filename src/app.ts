import { PLATFORM } from "aurelia-pal";
import { RouterConfiguration, Router, NavigationInstruction, Next } from "aurelia-router";

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;

    config.title = "Aurelia";
    config.addPipelineStep("postcomplete", ScrollToTop);
    config.map([
      { route: "", redirect: "portfolio" },
      { route: "portfolio", name: "portfolio", moduleId: PLATFORM.moduleName("./portfolio/portfolio"), nav: false, title: "Portfolio" },
      { route: "resume", name: "resume", moduleId: PLATFORM.moduleName("./resume/resume"), nav: false, title: "Resume" },
      { route: "about", name: "about", moduleId: PLATFORM.moduleName("./about/about"), nav: false, title: "About" },
    ]);

    config.mapUnknownRoutes({ route: "", redirect: "portfolio" });
  }
}

class ScrollToTop {
  run(instruction: NavigationInstruction, next: Next) {
    window.scrollTo(0, 0);

    return next();
  }
}
