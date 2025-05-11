# Database Structure Visualization

## Table: `products`

-   **Columns:**
    -   `id` (serial, primary key)
    -   `name` (text, NOT NULL)
    -   `category` (text, NULL)
    -   `description` (text, NULL)
    -   `price` (numeric(10,2), NOT NULL, DEFAULT 0.00)
    -   `image_url` (text, NULL)
    -   `stock` (integer, NULL, DEFAULT 0)
    -   `created_at` (timestamp with time zone, DEFAULT timezone('utc', now()))
    -   `updated_at` (timestamp with time zone, DEFAULT timezone('utc', now()))

## Functions:

1. **Function: `get_all_products`**

    - **Return Type:** `SETOF products`
    - **Definition:**
        ```sql
        select * from products order by created_at desc;
        ```

2. **Function: `get_product_by_id`**

    - **Arguments:** `pid integer`
    - **Return Type:** `products`
    - **Definition:**
        ```sql
        select * from products where id = pid;
        ```

3. **Function: `delete_product`**

    - **Arguments:** `pid integer`
    - **Return Type:** `void`
    - **Definition:**
        ```sql
        delete from products where id = pid;
        ```

4. **Function: `create_product`**

    - **Arguments:** `pname text, pcategory text, pdescription text, pprice numeric, pimage_url text, pstock integer`
    - **Return Type:** `products`
    - **Definition:**
        ```sql
        insert into products (name, category, description, price, image_url, stock)
        values (pname, pcategory, pdescription, pprice, pimage_url, pstock)
        returning *;
        ```

5. **Function: `update_product`**

    - **Arguments:** `pid integer, pname text, pcategory text, pdescription text, pprice numeric, pimage_url text, pstock integer`
    - **Return Type:** `SETOF products`
    - **Definition:**

        ```sql
        declare
          result record;
        begin
          update products set
            name = pname,
            category = pcategory,
            description = pdescription,
            price = pprice,
            image_url = pimage_url,
            stock = pstock,
            updated_at = timezone('utc', now())
          where id = pid
          returning * into result;

          return query select * from products where id = pid;
        end;
        ```
