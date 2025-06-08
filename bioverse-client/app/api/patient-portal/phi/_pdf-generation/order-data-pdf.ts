export function generateOrdersSectionHTML(ordersData: any[]) {
    let htmlContent = '';

    ordersData.forEach((order) => {
        htmlContent += `
        <h3>Order ID: ${order.id}</h3>
        <hr>
        <table>
          <tr><th colspan="2">Order Details</th></tr>
          <tr><td>Dosage information:</td><td>${order.variant_text}</td></tr>
          <tr><td>Subscription Type:</td><td>${order.subscription_type}</td></tr>
          <tr><td>Order Status:</td><td>${order.order_status}</td></tr>
          <tr><td>Product Name:</td><td>${order.product.name}</td></tr>
      `;

        if (order.rx_questionnaire_answers) {
            htmlContent += `
          <tr><th colspan="2">RX Questionnaire Answers</th></tr>
        `;
            Object.values(order.rx_questionnaire_answers).forEach(
                (value: unknown) => {
                    const answers = value as any[];
                    answers.forEach((answerObj: any) => {
                        htmlContent += `<tr><td>${answerObj.question}</td><td>${answerObj.answer}</td></tr>`;
                    });
                },
            );
        }

        htmlContent += `</table>`;
    });

    return htmlContent;
}
