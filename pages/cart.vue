/* eslint-disable */ /* eslint-disable prettier/prettier */
<template>
  <div>
    <Nav class="sticky top-0" />
    <div class="w-4/5 sm:w-1/2 mx-auto">
      <h1 class="m-5 font-bold text-lg">Your Cart</h1>
    </div>
    <div
      v-for="item in getCart"
      :key="item.id"
      class="w-4/5 sm:w-1/2 flex items-center space-x-3 mx-auto shadow-lg m-5 p-3"
    >
      <div>
        <img class="h-24" :src="`${item.url}`" alt="" />
      </div>
      <div>
        <p>
          {{ item.name }}
        </p>
        <p>
          {{ item.quantity | formatQuantity }}
        </p>
        <button class="button--delete" @click="deleteCartItem(item.id)">
          Delete
        </button>
      </div>
    </div>
    <div class="w-4/5 sm:w-1/2 mb-2 mx-auto">
      <p>
        <span>Total: </span> {{ formatCartTotal(getCartTotal) | formatPrice }}
      </p>
      <button
        v-show="getCartTotal > 0"
        class="button--green mx-auto"
        @click="handleSubmit"
      >
        checkout
      </button>
    </div>
    <Ads class="mx-auto sm:m-10" />
    <Footer />
  </div>
</template>

<script>
/* eslint-disable */ /* eslint-disable prettier/prettier */
import { mapGetters, mapActions } from 'vuex'
import { loadStripe } from '@stripe/stripe-js'
export default {
  data() {
    return {
      dataItems: {},
      session: {},
      stripe: {},
      stripePromise: {},
    }
  },
  computed: {
    ...mapGetters(['getCart', 'getCartTotal']),
  },
  mounted() {
    this.displayMessage()
  },
  methods: {
    async handleSubmit(e) {
      //   console.log(JSON.stringify(this.dataItems))
      e.preventDefault()
      const response = await this.$http.$post(
        `https://enigmatic-peak-00809.herokuapp.com/orders`,
        {
          cartDetail: this.getCart,
          cartTotal: this.getCartTotal.toFixed(2),
        }
      )
      this.$swal({
        title: 'Please wait',
        text: 'redirecting you to stripe, click ok',
        icon: 'success',
        button: 'Ok',
      })
      // stripe logic
      const stripePromise = loadStripe(
        PROCESS.env.STRIPE_KEY
      )
      const session = response
      const stripe = await stripePromise
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })
      console.log(response)
      if (result.error) {
        this.$nuxt.context.error(result.error.message)
      }
    },
    // using vue-swal to display messages
    displayMessage() {
      if (this.$route.query.success) {
        this.$swal({
          title: 'Order placed!',
          text: 'Thanks for placing your orders',
          icon: 'success',
          button: 'Ok',
        })
      } else if (this.$route.query.canceled) {
        this.$swal({
          title: 'Order canceled!',
          text: "continue to shop around and checkout when you're ready.",
          icon: 'warning',
          button: 'Ok',
        })
      }
    },
    formatCartTotal(num) {
      if (num > 0) {
        return num.toFixed(2)
      } else {
        return num
      }
    },
    ...mapActions(['deleteCartItem']),
  },
  filters: {
    formatPrice(price) {
      return `$${price}`
    },
    formatQuantity(num) {
      const qtyNum = num === 1 ? `${num} unit` : `${num} units`
      return qtyNum
    },
  },
}
</script>

<style scoped></style>
