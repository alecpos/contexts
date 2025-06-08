interface Answer {
    formData: string[];
    question: string;
    answer: string;
    metadata?: any;
}

interface IntakeRouteSpecification {
    [key: number]: RouteObject;
}

interface RouteObject {
    version: number;
    route_array: string[];
    ab_tests: ABTest[]; // split url test will follow these outes
}

interface ABTest {
    id: string;
    name: string;
    version: number;
    route_array: string[];
}

interface LatestIntakeSpecification {
    [key: string]: IntakeVersionSpecification;
}

interface IntakeVersionSpecification {
    latest_version: number;
    route_array: IntakeRouteSpecification;
}

interface LatestQuestionSpecification {
    [key: string]: IntakeQuestionSpecification;
}

interface IntakeQuestionSpecification {
    latest_version: number;
    product_href: string;
}
