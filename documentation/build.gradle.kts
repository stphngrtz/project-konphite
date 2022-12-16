plugins {
    // see https://asciidoctor.github.io/asciidoctor-gradle-plugin/development-3.x/user-guide/
    id("org.asciidoctor.jvm.convert") version "3.3.2"

    // see https://github.com/freefair/gradle-plugins/tree/master/plantuml-plugin
    // see https://docs.freefair.io/gradle-plugins/6.6/reference/#_plantuml
    id("io.freefair.plantuml") version "6.6"
}

repositories {
    mavenCentral()
}

tasks {
    plantUml {
        source("src/docs/plantuml")
    }

    register<Copy>("copyImages") {
       dependsOn(plantUml)
       from(layout.projectDirectory.dir("src/docs/images"))
       from(layout.buildDirectory.dir("plantuml"))
       into(layout.buildDirectory.dir("docs/asciidoc/images"))
    }

    asciidoctor {
        dependsOn("copyImages")
        baseDirFollowsSourceDir() // required for docinfo processing
    }
}
