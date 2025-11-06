<!-- 
 





<script lang="ts">
  import RouteFinder from "./RouteFinder.svelte";
  import Child1 from "./test/Child1.svelte";
  import Child2 from "./test/Child2.svelte";

  import { updateState } from "./test/test";

  let myBinding: string = $state("hfhfgfdh");
  let myBindingRead: string = $derived(updateState(myBinding));
</script>

<Child1 bind:myBinding />
<Child2 {myBindingRead} />
<RouteFinder />












<script lang="ts">
    import Header from "./Header.svelte";
    import timetb from "./RouteFinder.svelte";
  
    let formState = $state({
      name: "",
      birthday: "",
      step: 0,
      error: "",
    });
  </script>
  
  <Header name={formState.name} />
  
  <main>
    <p>step: {formState.step + 1}</p>
  
  {@render formStep({question: "what ur name", id:"name", type: "text"})}
  
    {#if formState.error}
      <p class="error">{formState.error}</p>
    {/if}
  </main>
  
  {#snippet formStep({question, id, type}:{type:string;id:string;question:string;})}
  <article>
    <div>
  <label for={id}>{question}</label>
  <input {type} {id} bind:value={formState[id]}>
    </div>  
  </article>  
  
  {/snippet}
  <style>
  
    .error {
      color: red;
    }
  </style>
  
  <!-- 
  let count = $state(0);
      
  let name = $state('test')
  let status: 'open' | 'closed' = $state('open')
  let fullname = $derived(name + " " + "abc")
  
  // function toggle(){
  // 	status = status === "open" ? "closed" : "open"
  // }
  function onclick(){
      status = status === "open" ? "closed" : "open"
  }
  
  <Header {name}/>
  <p>{fullname}</p>
  <input type="text" bind:value={name} />
  <p> the store is now {status}</p>
  <button {onclick}>toggle status</button>
  <p>{name.replaceAll('e','*')}</p>
  <button onclick={() => count -= 1}>-</button>
  <span>{ count }</span>
  <button onclick={() => count += 1}>+</button> -->
-->
